'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    _creator: {type: Number, ref: 'User'},
    label: String,
    options: Object,
});

module.exports = mongoose.model('Poll', Poll);