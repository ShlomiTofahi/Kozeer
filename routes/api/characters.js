const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const utils = require('../../services/utils');

//Character Model
const Character = require('../../models/Character');
//User Model
const User = require('../../models/User');

// @route   GET api/characters
// @desc    Get All Character
// @access  Public
router.get('/', (req, res) => {
    Character.find().then(characters => res.json(characters))
});

// @route   GET api/posts
// @desc    Get Character
// @access  Public
router.get('/:id', (req, res) => {
    Character.findById(req.params.id)
        .then(character => res.json(character))
});

// @route   POST api/characters/prop
// @desc    Add Prop To A Character
// @access  Private
router.post('/prop/:id', auth, (req, res) => {
    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        let { propImage } = req.body;

        //Simple validation
        if (!propImage) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        Character.findById(req.params.id).then(character => {
            character.propImages.push(propImage);
            character.save().then(() => {
                Character.findById(req.params.id)
                    .then(character => res.json(character))
            })
        }
        ).catch(err => res.status(404).json({ success: false }));
    })
});

// @route   POST api/chapters/char
// @desc    Edit A Character Image
// @access  Private
router.post('/char/:id', auth, (req, res) => {

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        let { charImage } = req.body;

        //Simple validation
        if (!charImage) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        Character.findById(req.params.id).then(character => {
            character.charImage = charImage;
            character.save().then(() => {
                Character.findById(req.params.id)
                    .then(character => res.json(character))
            })
        }
        ).catch(err => res.status(404).json({ success: false }));
    })
});

// @route   POST api/characters/edit
// @desc    Edit A character
// @access  Private
router.post('/:id', auth, (req, res) => {

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        let { name, description, avatarImage } = req.body;
        name = utils.toTitleCase(name)
        description = description.charAt(0).toUpperCase() + description.substring(1).toLowerCase();

        //Simple validation
        if (!name || !description || !avatarImage) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        var newCharacter = {
            name,
            description,
            avatarImage
        };

        Character.findById(req.params.id).then(character =>
            character.updateOne(newCharacter).then(() => {
                Character.findById(req.params.id)
                    .then(character => res.json(character))
            })
        ).catch(err => res.status(404).json({ success: false }));
    })
});



// @route   POST api/characters
// @desc    Create A Character
// @access  Private
router.post('/', auth, (req, res) => {
    let { name, description, avatarImage, charImage } = req.body;

    //Simple validation
    if (!name || !description || !avatarImage || !charImage) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    name = utils.toTitleCase(name)
    description = description.charAt(0).toUpperCase() + description.substring(1).toLowerCase();

    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if (user.admin) {
                const newCharacter = new Character({ name, description, avatarImage, charImage });
                newCharacter.save().then(character => {
                    Character.findOne(character).then(character => res.json(character));
                });
            } else {
                return res.status(400).json({ msg: 'No permission' });
            }
        })
});

// @route   DELETE api/characters/prop
// @desc    Delete Prop From A Character
// @access  Private
router.delete('/prop/:data', auth, (req, res) => {
    let { id, propImage } = JSON.parse(req.params.data);
    
    propImage = propImage.replace(/!@!/g, '/');

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        //Simple validation
        if (!propImage) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        Character.findById(id).then(character => {
            character.propImages = character.propImages.filter(element => element !== propImage);
            character.save().then(() => {
                Character.findById(id)
                    .then(character => res.json(character))
            })
        }
        ).catch(err => res.status(404).json({ success: false }));
    })
});

// @route   DELETE api/characters
// @desc    Delete Character By Character Id
// @access  Private
router.delete('/:id', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if (user.admin) {
                Character.findById(req.params.id).then(character => {
                    character.deleteOne().then(() => res.json({ success: true }));
                })
            } else {
                return res.status(400).json({ msg: 'No permission' });
            }
        })
});


module.exports = router;