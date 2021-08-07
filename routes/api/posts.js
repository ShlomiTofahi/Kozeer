const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const mailService = require('../../services/mailService');


//Post Model
const Post = require('../../models/Post');
//User Model
const User = require('../../models/User');
//Manga Model
const Manga = require('../../models/Manga');
//Subscribe Model
const Subscribe = require('../../models/Subscribe');

// @route   GET api/posts
// @desc    Get All Posts
// @access  Public
router.get('/', (req, res) => {
    Post.find().populate('mangas').populate('comments')
        .populate({ path: 'mangas', populate: { path: 'chapter' } })
        .sort({ published_date: -1 })
        .then(posts => res.json(posts))
});

// @route   GET api/posts
// @desc    Get Post
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate('mangas').populate('comments')
        .then(post => res.json(post))
});

// @route   POST api/posts
// @desc    Create A Post
// @access  Private
router.post('/', auth, (req, res) => {
    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        const { title, body, postImage, is_manga, mangasSelected } = req.body;
        //Simple validation
        if (!title) {
            return res.status(400).json({ msg: 'Please enter title' });
        }
        if (is_manga) {
            if (!mangasSelected.length) {
                return res.status(400).json({ msg: 'Please select pages' });
            }
        }

        let newPost = new Post({
            title,
            body,
            is_manga,
            mangas: []
        });

        if (postImage != '')
            newPost.postImage = postImage;

        newPost.save().then(post => {
            Post.findOne(post).populate('mangas').then(post => {
                if (is_manga) {
                    if (mangasSelected) {
                        Manga.find({ page: mangasSelected }).then(mangas => {
                            mangas.map((manga) => {
                                Manga.findOne(manga).then(mangaobj => {
                                    mangaobj.inuse = true;
                                    mangaobj.save();
                                })
                            })
                            post.mangas = mangas
                            Subscribe.find().then(subscribes => {
                                let recipients = subscribes.map(subscribe => subscribe.email);
                                let mangasTag = ''
                                mangasSelected.sort().map((manga, index) => {
                                    if (index + 1 !== mangasSelected.length)
                                        mangasTag += `&nbsp;` + manga + `,&nbsp;`;
                                    else
                                        mangasTag += `&nbsp;` + manga + `&nbsp;`;

                                })
                                mangasTag = `<span style="color:#c914c3">&nbsp;` + mangasTag + `&nbsp;<span>`
                                output = `
                                <div align='center'>
                                <h2 style="color:white;
                                           background-color:#fb6af7;
                                           text-align:center;
                                           border: solid 1px #c914c3;
                                           letter-spacing: 8px;">
                                  New Post Arrived!!
                                  </h2><br />
                                <hr />
                                <span style="font-family: Arial, Helvetica, sans-serif;
                                font-size:16px;
                                letter-spacing: .1rem;">
                                <p>
                                  Hello Kozeer's members,<br /> 
                                  New episodes </p>`+ mangasTag + `<p style="color:black">have been posted on our site.<br /> 
                                  For more information visit:<br /> 
                                  <a href='www.kozeerofficial.com'>www.kozeerofficial.com</a>
                                  <br />
                                  <br />
                                  Thanks, <br />
                                  Kozeer team.
                                </p>
                                <hr style="color:black" />
                                <div>
                            `

                                mailService.sendMail(recipients, output)
                                post.save().then((post) => res.json(post));
                            })
                        });
                    }
                }
                else {
                    return res.json(post);
                }
            })
        });
    })

});

// @route   POST api/items/edit
// @desc    Edit A Item
// @access  Private
router.post('/edit/:id', auth, (req, res) => {
    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        const { title, body, postImage, is_manga, mangasSelected } = req.body;

        //Simple validation
        if (!title) {
            return res.status(400).json({ msg: 'Please enter title' });
        }
        if (is_manga) {
            if (!mangasSelected.length) {
                return res.status(400).json({ msg: 'Please select pages' });
            }
        }

        let newPost = {
            title,
            body,
            is_manga,
        };

        if (postImage != '')
            newPost.postImage = postImage;

        let prevMangas = [];

        Post.findById(req.params.id).populate('mangas').then(post => {
            post.mangas.map(({ page }) => {
                prevMangas = [...prevMangas, page]
            })

            post.updateOne(newPost).then(() => {
                Post.findById(req.params.id).populate('mangas').populate('comments')
                    .then(post => {
                        if (is_manga) {
                            if (mangasSelected) {
                                Manga.updateMany({ page: prevMangas }, { inuse: false }, (err, mangas) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                    }
                                });
                                Manga.updateMany({ page: mangasSelected }, { inuse: true }, (err, mangas) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                    }
                                });

                                Manga.find({ page: mangasSelected }).then(newMangas => {
                                    post.mangas = newMangas;
                                    post.save();
                                })
                            }
                        }
                        return res.json(post);
                    })
            })
        }
        ).catch(err => res.status(404).json({ success: false }));
    })
});

// @route   DELETE api/posts
// @desc    Delete Post By Post Id
// @access  Private
router.delete('/:id', auth, (req, res) => {
    User.findById(req.user.id).then(CurrUser => {

        Post.findById(req.params.id).then(post => {
            if (!CurrUser.admin) {
                return res.status(400).json({ msg: 'No permission, Post does not belong to the user' });
            }

            User.find().select('-password').populate('mangas').populate('comments').then(users => {
                users.map(user => {
                    user.comments = user.comments.filter(comment => comment.post != req.params.id);
                    user.save().then(() => { });
                })
            })
            Comment.deleteMany({ post: post._id }).then(() => {
                let mangasPost = []
                if (post.is_manga) {

                    post.mangas.map((manga) => {
                        mangasPost.push(manga);
                        Manga.findOne(manga).then(mangaobj => {
                            mangaobj.inuse = false;
                            mangaobj.save();
                        })
                    })
                }
                post.deleteOne().then(() => res.json(mangasPost))
            }
            );
        })
    })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/posts/views
// @desc    Views A Post
// @access  Publice
router.post('/views/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            post.views = post.views + 1;
            post.save().then((post) => {
                Post.findOne(post).populate('mangas').populate('comments')
                    .then((post) => res.json(post));
            })
        })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/posts/loved
// @desc    Loved A Post
// @access  Publice
router.post('/loved/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            post.loved = post.loved + 1;
            post.save().then((post) => {
                Post.findOne(post).populate('mangas').populate('comments')
                    .then((post) => res.json(post));
            })
        })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/posts/unloved
// @desc    unLoved A Post
// @access  Publice
router.post('/unloved/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        post.loved = post.loved - 1;
        if (post.loved < 0)
            post.loved = 0;
        post.save().then((post) => {
            Post.findOne(post).populate('mangas').populate('comments').then((post) =>
                res.json(post)
            );
        })
    })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   GET api/posts/filter
// @desc    Get specific Post
// @access  Public
router.post('/filter', (req, res) => {
    const { title } = req.body;

    //Simple validation
    if (title == null)
        return res.status(400).json({ msg: 'One or more field is missing' });

    if (!title || title == "") {
        Post.find().populate('mangas').populate('comments')
            .sort({ date: -1 })
            .then(posts => res.json(posts))
    } else {
        var post = [];
        var postIdList = [];

        Post.find({ title: { $regex: title, $options: 'i' } }).select("_id").then(newPost => {
            if (title != "") {
                if (!newPost.length) {
                    return res.json([])
                }
                else {
                    postIdList = []
                    newPost.map(post => postIdList.push(String(post._id)))
                    if (!post.length) post = newPost;
                    if (newPost.length) post = post.filter(element => postIdList.includes(String(element._id)));
                }
            }
            Post.find({ "_id": { $in: post } })
                .populate('mangas').populate('comments')
                .sort({ date: -1 })
                .then(posts => res.json(posts))
        })
    }
});

module.exports = router;