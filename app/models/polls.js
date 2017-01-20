'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    _creator: {type: Schema.ObjectId, ref: 'users', required: true},
    label: String,
    options: Array,
});

module.exports = mongoose.model('Poll', Poll);