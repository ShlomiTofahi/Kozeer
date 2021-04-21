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
    loved: {
        type: Number,
        required: true,
        default: 0
    },
    postImage: {
        type: String,
        default: ''
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