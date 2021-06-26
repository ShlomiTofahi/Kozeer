const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');


//Manga Model
const Manga = require('../../models/Manga');
//User Model
const User = require('../../models/User');
//Post Model
const Post = require('../../models/Post');
//Chapter Model
const Chapter = require('../../models/Chapter');

// @route   GET api/mangas
// @desc    Get All Manga
// @access  Public
router.get('/', (req, res) => {
    Manga.find()
        .sort({ page: 1 })
        .then(manga => res.json(manga))
});

// @route   post api/mangas
// @desc    Create A Manga
// @access  Private
router.post('/', auth, (req, res) => {
    let { page, fullpage, chapter, mangaImage } = req.body;
    page = page.charAt(0).toUpperCase() + page.substring(1).toLowerCase();

    //Simple validation
    if (!page || !chapter || !mangaImage) {
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
                        Chapter.findOne({ name: chapter }).then(chapter => {

                            const newManga = new Manga({ page, fullpage, chapter, mangaImage });
                            newManga.save().then(manga => {
                                Manga.findOne(manga)
                                    .then(manga => {
                                        Manga.find({ chapter: chapter })
                                            .then(mangas => {
                                                chapter.mangas = mangas;
                                                chapter.save().then(() => {
                                                    {
                                                        Manga.findOne(manga).populate('chapter').populate({ path: 'chapter', populate: { path: 'mangas' } })
                                                            .then(manga => {
                                                                res.json(manga)
                                                            });
                                                    }
                                                })

                                            })
                                    });
                            });
                        })
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

        let { page, fullpage, mangaImage } = req.body;
        page = page.charAt(0).toUpperCase() + page.substring(1).toLowerCase();

        //Simple validation
        if (!page) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        var newManga = {
            page,
            fullpage,
            mangaImage
        };

        Manga.findById(req.params.id).then(manga =>
            manga.updateOne(newManga).then(() => {
                Manga.findById(req.params.id).populate('chapter').populate({ path: 'chapter', populate: { path: 'mangas' } })
                    .then(manga => res.json(manga))
            })
        ).catch(err => res.status(404).json({ manga }));
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
                        Chapter.findById(manga.chapter).populate('mangas').then(chapter => {
                            chapter.mangas = chapter.mangas.filter(manga => manga._id != req.params.id);
                            chapter.save().then(() => { });
                            Post.findOne({ manga }).then(post => {
                                if (post) return res.status(400).json({ msg: 'Cannot delete because there are posts under this manga' });
                                manga.deleteOne().then(() => res.json(chapter))
                            })
                        })
                    } else {
                        return res.status(400).json({ msg: 'No permission' });
                    }
                })
        })
        .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;