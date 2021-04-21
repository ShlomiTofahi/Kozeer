const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RatingSchema =  new Schema({
    overall: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = Rating = mongoose.model('Rating',RatingSchema);