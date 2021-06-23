const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require("../../middleware/auth");
// const fs = require('fs')

// //User Model
const User = require('../../models/User');

// @route   POST api/users/userid
// @desc    Get User By Email
// @access  Private
router.post('/userid', (req, res) => {
    const { email } = req.body;
    //Simple validation
    if (!email)
        return res.status(400).json({ msg: 'Please enter all fields' });

    User.findOne({ email })
        .then(user => {

            jwt.sign(
                { id: user.id },
                config.get('jwtSecret'),
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            _id: user.id,
                            name: user.name,
                            admin: user.admin,
                            email: user.email,
                            comments: user.comments,
                            profileImage: user.profileImage
                        }
                    });
                }
            )
        })
        .catch(err => res.status(404).json({ msg: 'User Does not exist' }));
});

// @route   DELETE api/users
// @desc    Delete User
// @access  Private
router.delete('/:id', auth, (req, res) => {
    User.findById(req.params.id)
        .then(user => user.deleteOne().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/users/edit
// @desc    Edit A User
// @access  Private
router.post('/edit/:id', auth, (req, res) => {

    const { name, profileImage, email } = req.body;

    //Simple validation
    if (!name || !profileImage || !email) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    var newUser = {
        name,
        profileImage,
        email
    };

    User.findById(req.params.id).then(user =>
        user.updateOne(newUser).then(() => {
            User.findById(req.params.id)
                .then(user => {
                    res.json(user)
                })
        }))
        .catch(err => res.status(404).json({ success: false }));
});

// @route   POST api/users/change-pass
// @desc    Change Password For A User
// @access  Private
router.post('/change-pass/:id', auth, (req, res) => {
    let { validationPassword, password, currentPassword } = req.body;

    //Simple validation
    if (!password || !validationPassword || !currentPassword) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (req.user.id !== req.params.id) {
        return res.status(400).json({ msg: 'User authentication faild' });
    }
    if (validationPassword !== password) {
        return res.status(400).json({ msg: 'Password authentication faild' });
    }

    User.findById(req.params.id).then(user => {

        // Validate password
        bcrypt.compare(currentPassword, user.password)
            .then(isMatch => {
                if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                // Create salt & hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;

                        password = hash;
                        user.updateOne({ password }).then(() => {
                            User.findById(req.params.id)
                                .then(user => {
                                    res.json(user)
                                })
                        })
                            .catch(err => res.status(404).json({ success: false })
                            );
                    })
                })
            })
    })
});

// @route   POST api/users/change-email
// @desc    Change Email For A User
// @access  Private
router.post('/change-email/:id', auth, (req, res) => {
    const { password, email } = req.body;

    //Simple validation
    if (!password || !email) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (req.user.id !== req.params.id) {
        return res.status(400).json({ msg: 'User authentication faild' });
    }

    User.findById(req.params.id).then(user => {

        // Validate password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                // Create salt & hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;

                        // password = hash;
                        user.updateOne({ email }).then(() => {
                            User.findById(req.params.id)
                                .then(user => {
                                    res.json(user)
                                })
                        })
                            .catch(err => res.status(404).json({ success: false })
                            );
                    })
                })
            })
    })
});

// @route   POST api/users/change-pass
// @desc    Change Password For A User By Email
// @access  Private
router.post('/change-pass-by-email/:id', auth, (req, res) => {
    let { validationPassword, password } = req.body;
    console.log('change-pass-by-email')
    console.log(req.body)
    //Simple validation
    if (!password || !validationPassword) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (req.user.id !== req.params.id) {
        return res.status(400).json({ msg: 'User authentication faild' });
    }
    if (validationPassword !== password) {
        return res.status(400).json({ msg: 'Password authentication faild' });
    }

    User.findById(req.params.id).then(user => {

        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {

                if (err) throw err;
                
                password = hash;
                user.updateOne({ password }).then(() => {
                    User.findById(req.params.id)
                        .then(user => {
                            res.json(user)
                        })
                })
                    .catch(err => res.status(404).json({ success: false })
                    );
            })
        })

    })
});


// @route   GET api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
    const { name, email, password, profileImage } = req.body;
    console.log("_________________profileImage________________")
    console.log(profileImage)

    //Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //check for existing user
    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                name,
                email,
                password
            });

            if (profileImage != '')
                newUser.profileImage = profileImage;

            // Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()

                        .then(user => {
                            User.findOne(user)
                                .then(user => {

                                    jwt.sign(
                                        { id: user.id },
                                        config.get('jwtSecret'),
                                        { expiresIn: 3600 },
                                        (err, token) => {
                                            if (err) throw err;
                                            res.json({
                                                token,
                                                user: {
                                                    _id: user.id,
                                                    name: user.name,
                                                    admin: user.admin,
                                                    email: user.email,
                                                    profileImage: user.profileImage
                                                }
                                            });
                                        }
                                    )
                                });
                        });
                })
            })
        })
});

module.exports = router;