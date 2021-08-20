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

// @route   POST api/characters/edit
// @desc    Edit A character
// @access  Private
router.post('/edit/:id', auth, (req, res) => {

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        let { name, description, avatarImage, charImage } = req.body;
        name = utils.toTitleCase(name)
        description = description.charAt(0).toUpperCase() + description.substring(1).toLowerCase();

        //Simple validation
        if (!name || !description || !avatarImage || !charImage) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        var newCharacter = {
            name,
            description,
            avatarImage,
            charImage
        };

        Character.findById(req.params.id).then(character =>
            character.updateOne(newCharacter).then(() => {
                Character.findById(req.params.id)
                    .then(character => res.json(character))
            })
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