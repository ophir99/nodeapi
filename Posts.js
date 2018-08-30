

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {type:String},
    desc: String,
    createdBy: String
});


const postModel = mongoose.model('Posts', postSchema);

module.exports = postModel;