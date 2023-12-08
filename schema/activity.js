"use strict";

var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    name: String,
    date_time: {type: Date, default: Date.now},
    type: String,
    uploaded_photo_file_name: {type: String, default: null},
    commented_photo_file_name: {type:String, default: null},
    commented_photo_author: {type: String, default: null},
    deleted_photo_file_name: {type:String, default: null},
    deleted_comment_file_name: {type:String, default: null},
    liked_photo_file_name: {type:String, default: null},
    Unliked_photo_file_name: {type:String, default: null},
});

var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
