const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ChapterSchema = new Schema({
    name: String,
    chapterImage: {
        type: String,
        default: ''
    },
    mangas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manga"
    }]
});

module.exports = Chapter = mongoose.model('Chapter', ChapterSchema);