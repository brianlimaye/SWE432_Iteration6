const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    title: String,
    artist: String,
    imageURL: String
});

module.exports = mongoose.model("saves", saveSchema);