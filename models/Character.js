const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CharacterSchema = new Schema({
    name: String,
    description: String,
    avatarImage: {
        type: String,
        default: ''
    },
    charImage: {
        type: String,
        default: ''
    },
    propImags: {
        type: [{
            type: String
        }],
        default: []
    }
});

module.exports = Character = mongoose.model('Character', CharacterSchema);