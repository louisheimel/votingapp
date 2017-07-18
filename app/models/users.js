'use strict';
var Poll = require('./polls.js');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	twitter: {
    	id: String,
    	token: String,
    	username: String,
        displayName: String
	},
	posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

userSchema.methods.createPoll = function createPoll(poll) {
	return new Poll({_creator: this._id, label: poll.label, options: poll.options});
}

var User = mongoose.model('User', userSchema);


module.exports = User;