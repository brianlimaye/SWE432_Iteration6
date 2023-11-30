const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    song: String,
    message: String
});

module.exports = mongoose.model("comments", commentSchema);