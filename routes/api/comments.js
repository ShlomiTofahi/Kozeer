const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


//User Model
const Comment = require('../../models/Comment');
//User Model
const User = require('../../models/User');
// //Post Model
// const Post = require('../../models/Post');

// @route   GET api/comments
// @desc    Get All Commends
// @access  Public
router.get('/', (req, res) => {
    Comment.find()
        .sort({ comment_date: -1 })
        .then(comments => res.json(comments))
});

// @route   GET api/comments
// @desc    Get All Commends of Post by Given Post Id 
// @access  Public
router.get('/:id', (req, res) => {
    Comment.find({ post: req.params.id }).populate('post').populate('user')
        .sort({ comment_date: -1 })
        .then(comments => {
            res.json(comments)
        })
});

// @route   POST api/comments
// @desc    Create A Commend For Post by Given Post Id
// @access  Private
router.post('/:id', auth, (req, res) => {
    const { body } = req.body;

    //Simple validation
    if (!body) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findById(req.user.id).select('-password').then(user => {
        Post.findById(req.params.id).then(post => {
            const newComment = new Comment({
                user,
                post,
                body
            });

            newComment.save().then(comment => {
                Comment.findOne(comment).populate('post').populate('user').then(comment => {
                    Comment.find({ post: req.params.id }).populate('post').populate('user').then(post_comments => {
                        Comment.find({ user: req.user.id }).populate('post').populate('user').then(user_comments => {

                            post.comments = post_comments;
                            user.comments = user_comments;
                            post.save().then(() => {
                                user.save().then(() => {
                                    res.json(comment);
                                });
                            })
                        })
                    })
                });
            });
        })
    })
});


// @route   DELETE api/comments
// @desc    Delete Comments By Post & Comment Id
// @access  Private
router.delete('/:data', auth, (req, res) => {
    const { post_id, command_id } = JSON.parse(req.params.data);

    //Simple validation
    if (!post_id || !command_id) {
        return res.status(400).json({ msg: 'id missing' });
    }

    Comment.findById(command_id).then(comment => {
            var isAdmin = false;
            User.findById(req.user.id).then(user => { user.admin ? isAdmin = true : isAdmin = false; })

            User.findById(comment.user).select('-password').then(user => {
                Post.findById(post_id).then(post => {
                    if (!isAdmin && user._id != req.user.id) {
                        return res.status(400).json({ msg: 'Comment does not belong to the user' });
                    }

                    Comment.find({ user: user._id }).then(comments => {
                        user.comments = comments.filter(comment => comment._id != command_id);

                        Comment.find({ post: post._id }).then(comments => {
                            post.comments = comments.filter(comment => comment._id != command_id);

                            post.save().then(() => {
                                user.save().then(() => {
                                    comment.deleteOne().then(() => res.json({ success: true }));
                                })
                            })
                        })
                    })
                })
            })
        })
        .catch(err => res.status(404).json({ success: false }));
});

// // @route   DELETE api/comments/post
// // @desc    Delete All Post Comments
// // @access  Private
// router.delete('/post/:id', auth, (req, res) => {

//     Comment.find({ user: req.user.id }).then(comments => {
//         Post.findById(req.params.id).then(post => {
//             User.findById(req.user.id).select('-password').then(user => {
//                 user.comments = comments.filter(comment => comment.post != req.params.id);
//                 post.comments = [];
//                 post.save().then(() => {
//                     user.save().then(() => {
//                         Comment.deleteMany({ post: req.params.id }).then(() => res.json({ success: true }))
//                     })
//                 })
//             })
//         })
//     }).catch(err => res.status(404).json({ success: false }));
// });

// // @route   DELETE api/comments/user
// // @desc    Delete All User Comments in all Posts
// // @access  Private
// router.delete('/user', auth, (req, res) => {

//     Post.find().populate('comments').then(posts => {
//         User.findById(req.user.id).select('-password').select('-password').then(user => {
//             user.comments = [];
//             posts.map(post => {
//                 Comment.find({ post: post._id }).then(comments => {

//                     post.comments = post.comments.filter(comment => comment.user != req.user.id);
//                     post.save();
//                 })
//             })

//             user.save().then(() => {
//                 Comment.deleteMany({ user: req.user.id }).then(() => res.json({ success: true }))
//             })
//         })
//     }).catch(err => res.status(404).json({ success: false }));
// });

// // @route   DELETE api/posts
// // @desc    Delete All User Comments for specific post
// // @access  Private
// router.delete('/user/:id', auth, (req, res) => {

//     Comment.find({ post: req.params.id }).then(comments => {
//         Post.findById(req.params.id).then(post => {
//             User.findById(req.user.id).select('-password').then(user => {
//                 user.comments = user.comments.filter(comment => comment.post != req.params.id)
//                 post.comments = comments.filter(comment => comment.user != req.user.id);
//                 post.save().then(() => {
//                     user.save().then(() => {
//                         Comment.deleteMany({ user: req.user.id }).then(() => res.json({ success: true }))
//                     })
//                 })
//             })
//         })
//     }).catch(err => res.status(404).json({ success: false }));
// });


module.exports = router;