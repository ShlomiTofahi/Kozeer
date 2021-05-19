const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Post Model
const Post = require('../../models/Post');
//User Model
const User = require('../../models/User');
//Manga Model
const Manga = require('../../models/Manga');

// @route   GET api/posts
// @desc    Get All Posts
// @access  Public
router.get('/', (req, res) => {
    Post.find().populate('mangas').populate('comments')
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

    User.findById(req.user.id).then(user => {

        let newPost = new Post({
            title,
            body,
            is_manga,
            mangas: []
        });

        if (postImage != '')
            newPost.postImage = postImage;

        newPost.save().then(post => {
            Post.findOne(post).then(post => {
                if (is_manga) {
                    if (mangasSelected) {
                        Manga.find({ page: mangasSelected }).then(mangas => {
                            post.mangas = mangas
                            post.save();
                        })
                    }
                }
                res.json(post);
            })
        });
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
            Comment.deleteMany({ post: post._id }).then(posts => { })
            post.deleteOne().then(() => res.json({ success: true }));
        })
    })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/posts/views
// @desc    Views A Post
// @access  Publice
router.post('/views/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        post.views = post.views + 1;
        post.save().then(() => res.json({ success: true }));
    })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/posts/loved
// @desc    Loved A Post
// @access  Publice
router.post('/loved/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        post.loved = post.loved + 1;
        post.save().then((post) => {
            Post.findOne(post).populate('mangas').populate('comments').then((post) =>
                res.json(post)
            );
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
            Post.find({ "_id": { $in: post } }).populate('mangas').populate('comments')
                .sort({ date: -1 })
                .then(posts => res.json(posts))
        })
    }
});

module.exports = router;