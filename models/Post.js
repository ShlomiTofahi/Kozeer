const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
    title: String,
    body: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    mangas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manga"
    }],
    is_manga: {
        type: Boolean,
        required: true,
        default: false
    },
    postImage: {
        type: String,
        default: ''
    },
    loved: {
        type: Number,
        required: true,
        default: 0
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    published_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('Post', PostSchema);