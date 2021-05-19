const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema =  new Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },  
    profileImage: {
        type: String,
        required: true,
        default: '/uploads/users/no-image.png'
    },
    secret: {
        type: String,
        required: false
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
     }],
    register_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('User',UserSchema);