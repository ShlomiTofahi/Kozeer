const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SettingSchema = new Schema({
    myVision: {
        type: String,
        default: ''
    },
    headerColorText: {
        type: String,
        default: ''
    },
    headerHoverColorText: {
        type: String,
        default: ''
    },
    headerColorTop: {
        type: String,
        default: ''
    },
    headerColorBottom: {
        type: String,
        default: ''
    },
    headerImage: {
        type: String,
        default: ''
    },
    bgImage: {
        type: String,
        default: ''
    },
    coverBookImage: {
        type: String,
        default: ''
    },
});

module.exports = Setting = mongoose.model('Setting', SettingSchema);