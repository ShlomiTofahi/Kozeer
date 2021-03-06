const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


//User Model
const Comment = require('../../models/Comment');
//User Model
const User = require('../../models/User');

// @route   GET api/comments
// @desc    Get All Commends
// @access  Public
router.get('/', (req, res) => {
    Comment.find()
        .sort({ published_date: -1 })
        .then(comments => res.json(comments))
});

// @route   GET api/comments
// @desc    Get All Commends of Post by Given Post Id 
// @access  Public
router.get('/:data', (req, res) => {
    const { post_id, order } = JSON.parse(req.params.data);
    Comment.find({ post: post_id }).populate('post').populate('user').populate('comment').populate({ path: 'comment', populate: { path: 'user' } }).populate({ path: 'comments', populate: { path: 'user' } })
        .sort({ published_date: order })
        .then(comments => res.json(comments));
});

// @route   POST api/comments/reply/asguest
// @desc    Create A Commend For A Commend In A Post by Given Post Id As A Guest
// @access  Public
router.post('/reply/asguest/:data', (req, res) => {
    const { post_id, command_id, body } = JSON.parse(req.params.data);

    //Simple validation
    if (!body) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    Comment.findById(command_id).then(comment => {
        User.findOne({ email: 'none@none.com' }).select('-password').then(user => {
            Post.findById(post_id).then(post => {
                const newComment = new Comment({
                    user,
                    post,
                    body,
                    comment
                });

                newComment.save().then(comment2 => {
                    Comment.findOne(comment2).populate('post').populate('user').populate('comment').populate('comments').then(comment3 => {
                        Comment.find({ post: req.params.id }).populate('post').populate('user').then(post_comments => {
                            Comment.find({ user }).populate('post').populate('user').then(user_comments => {

                                comment.comments = [...comment.comments, comment3]
                                post.comments = post_comments;
                                user.comments = user_comments;
                                post.save().then(() => user.save()
                                    .then(() => comment.save().then(() => res.json(comment3)))
                                );
                            })
                        })
                    });
                });
            })
        })
    })
});

// @route   POST api/comments/reply
// @desc    Create A Commend For A Commend In A Post by Given Post Id
// @access  Private
router.post('/reply/:data', auth, (req, res) => {
    const { post_id, command_id, body } = JSON.parse(req.params.data);

    //Simple validation
    if (!body) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    Comment.findById(command_id).then(comment => {
        User.findById(req.user.id).select('-password').then(user => {
            Post.findById(post_id).then(post => {
                const newComment = new Comment({
                    user,
                    post,
                    body,
                    comment
                });

                newComment.save().then(comment2 => {
                    Comment.findOne(comment2).populate('post').populate('user').populate('comment').populate('comments').then(comment3 => {
                        Comment.find({ post: req.params.id }).populate('post').populate('user').then(post_comments => {
                            Comment.find({ user: req.user.id }).populate('post').populate('user').then(user_comments => {

                                comment.comments = [...comment.comments, comment3]
                                post.comments = post_comments;
                                user.comments = user_comments;
                                post.save().then(() =>
                                    user.save().then(() =>
                                        comment.save().then(() => res.json(comment3))
                                    )
                                );
                            })
                        })
                    });
                });
            })
        })
    })
});

// @route   POST api/comments/asguest
// @desc    Create A Commend For Post by Given Post Id As A Guest
// @access  Public
router.post('/asguest/:id', (req, res) => {
    const { body } = req.body;
    //Simple validation
    if (!body) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email: 'none@none.com' }).select('-password').then(user => {
        Post.findById(req.params.id).then(post => {
            const newComment = new Comment({
                user,
                post,
                body
            });

            newComment.save().then(comment => {
                Comment.findOne(comment).populate('post').populate('user').populate('comment').populate('comments').then(comment => {
                    Comment.find({ post: req.params.id }).populate('post').populate('user').then(post_comments => {
                        Comment.find({ user }).populate('post').populate('user').then(user_comments => {

                            post.comments = post_comments;
                            user.comments = user_comments;
                            post.save().then(() => user.save().then(() => res.json(comment)));
                        })
                    })
                });
            });
        })
    })
});

// @route   POST api/comments/loved
// @desc    Loved A Comment
// @access  Publice
router.post('/loved/:id', (req, res) => {
    Comment.findById(req.params.id)
        .then(comment => {
            comment.loved = comment.loved + 1;
            comment.save()
                .then((comment) => {
                    Comment.findOne(comment).populate('post').populate('user').populate('comment')
                        .populate({ path: 'comment', populate: { path: 'user' } })
                        .populate({ path: 'comments', populate: { path: 'user' } })
                        .then((comment) => res.json(comment));
                })
        })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/comments/unloved
// @desc    unLoved A Comment
// @access  Publice
router.post('/unloved/:id', (req, res) => {
    Comment.findById(req.params.id).then(comment => {
        comment.loved = comment.loved - 1;
        if (comment.loved < 0)
            comment.loved = 0;
        comment.save().then((comment) => {
            Comment.findOne(comment).populate('post').populate('user').populate('comment')
                .populate({ path: 'comment', populate: { path: 'user' } })
                .populate({ path: 'comments', populate: { path: 'user' } })
                .then((comment) => res.json(comment));
        })
    })
        .catch(err => res.status(404).json({ success: false }));
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
                Comment.findOne(comment).populate('post').populate('user').populate('comment').populate('comments')
                    .then(comment => {
                        Comment.find({ post: req.params.id }).populate('post').populate('user')
                            .then(post_comments => {
                                Comment.find({ user: req.user.id }).populate('post').populate('user')
                                    .then(user_comments => {
                                        post.comments = post_comments;
                                        user.comments = user_comments;
                                        post.save().then(() => user.save()
                                            .then(() => res.json(comment))
                                        );
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
                Comment.findById(comment.comment).then(fatherComment => {
                    if (fatherComment) {
                        fatherComment.comments = fatherComment.comments.filter(comment => comment._id != command_id)
                        fatherComment.save();
                    }
                    Comment.find({ user: user._id }).then(comments => {
                        user.comments = comments.filter(comment => comment._id != command_id);

                        Comment.find({ post: post._id }).then(comments => {
                            post.comments = comments.filter(comment => comment._id != command_id);

                            post.save().then(() =>
                                user.save().then(() =>
                                    comment.deleteOne().then(() =>
                                        Comment.deleteMany({ comment: command_id }).then(() =>
                                            res.json({ success: true })
                                        )
                                    )
                                )
                            );
                        })
                    })
                })
            })
        })
    })
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;