const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    videoFormat: { type: String, required: true }
    
});

module.exports = mongoose.model('Video', videoSchema);