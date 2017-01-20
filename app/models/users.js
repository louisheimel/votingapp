'use strict';
var Poll = require('./polls.js');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	github: {
    	id: String,
    	displayName: String,
    	username: String,
        publicRepos: Number
	},
	posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

userSchema.methods.createPoll = function createPoll(poll) {
	return new Poll({_creator: this._id, label: poll.label, options: poll.options});
}

var User = mongoose.model('User', userSchema);


module.exports = User;