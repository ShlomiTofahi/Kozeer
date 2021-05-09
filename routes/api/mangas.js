const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


//Manga Model
const Manga = require('../../models/Manga');
//User Model
const User = require('../../models/User');
//Post Model
const Post = require('../../models/Post');

// @route   GET api/mangas
// @desc    Get All Manga
// @access  Public
router.get('/', (req, res) => {
    Manga.find()
        .then(manga => res.json(manga))
});

// @route   post api/mangas
// @desc    Create A Manga
// @access  Private
router.post('/', auth, (req, res) => {
    const { page, mangaImage } = req.body;

    //Simple validation
    if (!page || !mangaImage) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    //check for existing manga
    Manga.findOne({ page })
        .then(manga => {
            if (manga) return res.status(400).json({ msg: 'Page already exists' });
            User.findById(req.user.id)
                .select('-password')
                .then(user => {
                    if (user.admin) {
                        const newManga = new Manga({ page, mangaImage });
                        newManga.save().then(manga => {
                            Manga.findOne(manga)
                                .then(manga => {
                                    res.json(manga)
                                });
                        });
                    } else {
                        return res.status(400).json({ msg: 'No permission' });
                    }
                })
        })
});

// @route   POST api/mangas/edit
// @desc    Edit A Manga
// @access  Private
router.post('/edit/:id', auth, (req, res) => {

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        const { page, mangaImage } = req.body;

        //Simple validation
        if (!page) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        var newManga = {
            page,
            mangaImage
        };

        Manga.findById(req.params.id).then(manga =>
            manga.updateOne(newManga).then(() => {
                Manga.findById(req.params.id)
                    .then(manga => res.json(manga))
            })
        ).catch(err => res.status(404).json({ success: false }));
    })

});

// @route   DELETE api/mangas
// @desc    Delete Manga
// @access  Private
router.delete('/:id', auth, (req, res) => {
    Manga.findById(req.params.id)
        .then(manga => {
            User.findById(req.user.id)
                .select('-password')
                .then(user => {
                    if (user.admin) {
                        Post.findOne({ manga }).then(post => {
                            if (post) return res.status(400).json({ msg: 'Cannot delete because there are posts under this manga' });

                            manga.deleteOne().then(() => res.json({ success: true }))
                        })
                    } else {
                        return res.status(400).json({ msg: 'No permission' });
                    }
                })
        })
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;