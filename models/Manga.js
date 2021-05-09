const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MangaSchema = new Schema({
    page: String,
    mangaImage: {
        type: String,
        default: ''
    },
});

module.exports = Mana = mongoose.model('Manga', MangaSchema);