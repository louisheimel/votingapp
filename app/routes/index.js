'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var fs = require('fs');
var cheerio = require('cheerio');
var Handlebars = require('handlebars');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.redirect('/polls')
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/failure'
		}));
		
	app.route('/polls')
		.get(isLoggedIn, function(req, res) {
			var template = fs.readFileSync('./public/index.html');
			var $ = cheerio.load(template);
			var header = Handlebars.compile($('#header').text());
			$('body').prepend(header({username: req.user.twitter.username}));
			res.end($.html());
		});
		
	app.route('/poll/:id')
		.get(function(req, res) {
			var Poll = require('../models/polls');

			
			Poll.find({_id: req.params.id}, function(err, poll) {
				if (err) throw err;
				var template = fs.readFileSync('./public/showpoll.html').toString();
			    var $ = cheerio.load(template);
			    var options = Handlebars.compile($('#header').text());
			    var navbar = Handlebars.compile($('#navbar').text());
			    var chart = Handlebars.compile($('#chart').text());
			    var chart_data = {
			    	counts: poll[0].options.map((e) => { return e.count }),
			    	labels: poll[0].options.map((e) => { return e.option }),
			    };
			    $('body').prepend(navbar({
			    	username: (req.hasOwnProperty('user') ? req.user.twitter.username : 'Guest'),
			    	userLoggedIn: req.hasOwnProperty('user'),
			    }));
			    $('body').append(options(poll[0]));

			    $('body').append(chart(chart_data));
			    

				res.end($.html());
			})
		})
		.post();
	
	app.route('/mypolls')
		.get(isLoggedIn, pollHandler.showMyPolls);
		
	app.route('/newpoll')
		.get(isLoggedIn, function(req, res) { 
			var template = fs.readFileSync('./public/newpoll.html').toString();
			var $ = cheerio.load(template);
			var header = Handlebars.compile($('#navbar').text());
			$('body').prepend(header({username: req.user.twitter.username}));
			res.end($.html());
		})
		.post(isLoggedIn, pollHandler.submitPoll);
	
	app.route('/api/all/polls')
		.get(pollHandler.getAllPolls);
		
	app.route('/api/vote/:poll/:option')
		.get(pollHandler.votePoll);
		
	app.route('/api/vote/:poll')
		.get(pollHandler.votePoll);
		
	app.route('/delete/poll/:id')
		.get(isLoggedIn, pollHandler.deletePoll);
		
	app.route('/api/:id/polls')
		.get(isLoggedIn, pollHandler.getAllPolls);

};