const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema =  new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
     post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
     },
     body: String,
    comment_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Comment = mongoose.model('Comment',CommentSchema);