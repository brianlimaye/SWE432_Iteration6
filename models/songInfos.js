const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    imageURL: String,
    moreinfo: String
});

module.exports = mongoose.model("songInfos", songSchema);