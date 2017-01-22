'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');

var fs = require('fs'),
    cheerio = require('cheerio'),
    Handlebars = require('handlebars');


function PollHandler() {
    this.getAllPolls = function(req, res) {
        Poll.find({}, function(err, polls) {
            if (err) throw err;
            res.json(polls);
        });
    };
    this.votePoll = function(req, res) {
        var option = req.params.option;
        var poll = req.params.poll;
        
        if (!!req.query.userinput) {
            Poll.find({_id: poll}, function(err, current_poll) {
                if (err) throw err;
                var new_options = current_poll[0]['options'].slice().concat({
                    option: req.query.userinput,
                    count: 1,
                });
                Poll.findOneAndUpdate({_id: poll}, {options: new_options}, function(err, current_poll) {
                    if (err) throw err;
                    res.redirect('/poll/' + poll);
                });
            })
        } else {
        
            Poll.find({_id: poll}, function(err, current_poll) {
                if (err) throw err;
                var updated_count = current_poll[0]['options'][option]['count'] + 1;
                var new_options = current_poll[0]['options'].map(function(e, i) {
                    if (i === +option) {
                        return { count: updated_count, option: e.option };
                    } else {
                        return e;
                    }
                });
                // res.json(new_options);
                Poll.findOneAndUpdate({_id: poll}, {options: new_options}, function(err, p) {
                    if (err) throw err;
                    res.redirect('/poll/' + poll)
                });
            })
        }
    }
    
    this.submitPoll = function(req, res) {
        var newpoll = new Poll({ 
            label: req.body.title, 
            options: req.body.options.split('\n').map((e) => { return {option: e.trim(), count: 0}; }), 
            _creator: req.session.passport.user,
        });
        newpoll.save(function(err, newpoll) { if (err) throw err; });
        res.redirect('/polls');
    };
    
    this.showMyPolls = function(req, res) {
        Poll.find({_creator: req.session.passport.user}, function(err, polls) {
            if (err) throw err;
            var template = fs.readFileSync('./public/mypolls.html').toString();
			var $ = cheerio.load(template);
			var pollsCompiler = Handlebars.compile($('#polls').text());
			var header = Handlebars.compile($('#navbar').text());
			$('body').append(pollsCompiler(polls));
			$('body').prepend(header({username: req.user.github.username}));
			res.end($.html());
        })
    }
    
    this.deletePoll = function(req, res) {
        Poll.remove({_id: req.params.id, _creator: req.session.passport.user}, function(err, polls) {
            if (err) throw err;
            res.redirect('/polls');
        })
    }
}

module.exports = PollHandler;