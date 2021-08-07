const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Chapter Model
const Chapter = require('../../models/Chapter');
//User Model
const User = require('../../models/User');
//Manga Model
const Manga = require('../../models/Manga');

// @route   GET api/chapters
// @desc    Get All Chapter
// @access  Public
router.get('/', (req, res) => {
    Chapter.find().populate('mangas')
        .sort({ name: 1 })
        .then(Chapters => res.json(Chapters))
});

// @route   POST api/chapters
// @desc    Create A Chapter
// @access  Private
router.post('/', auth, (req, res) => {
    let { name, chapterImage } = req.body;
    name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();

    //Simple validation
    if (!name || !chapterImage) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //check for existing chapter
    Chapter.findOne({ name })
        .then(chapter => {
            if (chapter) return res.status(400).json({ msg: 'Chapter already exists' });
            User.findById(req.user.id)
                .select('-password')
                .then(user => {
                    if (user.admin) {
                        const newChapter = new Chapter({ name, chapterImage });
                        newChapter.save().then(chapter => {
                            Chapter.findOne(chapter).populate('mangas')
                                .then(chapter => res.json(chapter));
                        });
                    } else {
                        return res.status(400).json({ msg: 'No permission' });
                    }
                })
        })
});

// @route   POST api/chapters/edit
// @desc    Edit A Chapter
// @access  Private
router.post('/edit/:id', auth, (req, res) => {

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        let { name, chapterImage } = req.body;
        name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();

        //Simple validation
        if (!name) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        var newChapter = {
            name,
            chapterImage
        };

        Chapter.findById(req.params.id).then(chapter =>
            chapter.updateOne(newChapter).then(() => {
                Chapter.findById(req.params.id).populate('mangas')
                    .then(chapter => res.json(chapter))
            })
        ).catch(err => res.status(404).json({ success: false }));
    })
});

// @route   DELETE api/chapters
// @desc    Delete Chapter By Chapter Id
// @access  Private
router.delete('/:id', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if (user.admin) {
                Chapter.findById(req.params.id).then(chapter => {
                    Manga.deleteMany({ chapter: chapter._id }).then(() => {
                        chapter.deleteOne().then(() => res.json({ success: true }));
                    })
                })
            } else {
                return res.status(400).json({ msg: 'No permission' });
            }
        })
});



module.exports = router;