const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MangaSchema = new Schema({
    page: String,
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter"
    },
    fullpage: {
        type: Boolean,
        required: true,
        default: false
    },
    inuse: {
        type: Boolean,
        required: true,
        default: false
    },
    mangaImage: {
        type: String,
        default: ''
    },
});

module.exports = Mana = mongoose.model('Manga', MangaSchema);