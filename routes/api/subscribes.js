const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Subscribe Model
const Subscribe = require('../../models/Subscribe');
//User Model
const User = require('../../models/User');

// @route   GET api/subscribes
// @desc    Get All Subscribes mails
// @access  Public
router.get('/', (req, res) => {
    Subscribe.find().then(subscribe => res.json(subscribe))
});

// @route   POST api/subscribes
// @desc    Add A Subscribe
// @access  public
router.post('/', (req, res) => {
    let { email } = req.body;
    email = email.toLowerCase();
    //Simple validation
    if (!email) {
        return res.status(400).json({ msg: 'Please enter email' });
    }

    //check for existing subscribe
    Subscribe.findOne({ email })
        .then(subscribe => {
            if (subscribe) return res.status(400).json({ msg: 'Email already exists' });
            const newSubscribe = new Subscribe({ email });
            newSubscribe.save().then(subscribe => {
                Subscribe.findOne(subscribe).then(subscribe => res.json(subscribe));
            });
        })
});

// @route   DELETE api/subscribes
// @desc    Delete Subscribe By Subscribe Id
// @access  Private
router.delete('/:id', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if (user.admin) {
                Subscribe.findById(req.params.id).then(subscribe => {
                    subscribe.deleteOne().then(() => res.json({ success: true }));
                })
            } else {
                return res.status(400).json({ msg: 'No permission' });
            }
        })
});

module.exports = router;