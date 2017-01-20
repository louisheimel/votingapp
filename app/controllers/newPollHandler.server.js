'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var mongoose = require('mongoose');

function PollHandler () {
    this.submitPoll = function(req, res) {
        var newpoll = new Poll({ 
            label: req.body.title, 
            options: req.body.options.split('\n').map((e) => { return {option: e.trim(), count: 0}; }), 
            _creator: req.session.passport.user,
        });
        newpoll.save(function(err, newpoll) { if (err) throw err; });
        res.redirect('/polls');
    };
    
    this.getMyPolls = function(req, res) {
        Poll.find({_creator: req.session.passport.user}, function(err, polls) {
            if (err) throw err;
            res.json(polls);
        })
    }
}

module.exports = PollHandler;