const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Post Model
const Post = require('../../models/Post');
//User Model
const User = require('../../models/User');

// @route   GET api/posts
// @desc    Get All Posts
// @access  Public
router.get('/', (req, res) => {
    Post.find().populate('comments')
        .sort({ published_date: -1 })
        .then(posts => res.json(posts))
});

// @route   GET api/posts
// @desc    Get Post
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate('comments')
        .then(post => res.json(post))
});

// @route   POST api/posts
// @desc    Create A Post
// @access  Private
router.post('/', auth, (req, res) => {
    const { title, body, postImage } = req.body;

    //Simple validation
    if (!title || !body) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findById(req.user.id).then(user => {

        const newPost = new Post({
            title,
            body
        });

        if (postImage != '')
            newPost.postImage = postImage;

        newPost.save().then(post => {
            Post.findOne(post).then(post => {
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

            User.find().select('-password').populate('comments').then(users => {
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
// @access  Private
router.post('/views/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        post.views = post.views + 1;
        post.save().then(() => res.json({ success: true }));
    })
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/posts/views
// @desc    Loved A Post
// @access  Private
router.post('/loved/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        post.loved = post.loved + 1;
        post.save().then(() => res.json({ success: true }));
    })
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;