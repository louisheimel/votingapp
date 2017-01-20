'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var NewPollHandler = require(path + '/app/controllers/newPollHandler.server.js');
var fs = require('fs');
var cheerio = require('cheerio');
var Handlebars = require('handlebars');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();
	var newPollHandler = new NewPollHandler();

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

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		
	app.route('/polls')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/poll/:id')
		.get(function(req, res) {
			var Poll = require('../models/polls');

			
			Poll.find({_id: req.params.id}, function(err, poll) {
				if (err) throw err;
				var template = fs.readFileSync('./public/showpoll.html').toString();
			    var $ = cheerio.load(template);
			    var options = Handlebars.compile($('#header').text());
			    var chart = Handlebars.compile($('#chart').text());
			    $('body').append(options(poll[0]));
			    var chart_data = {
			    	counts: poll[0].options.map((e) => { return e.count }),
			    	labels: poll[0].options.map((e) => { return e.option }),
			    };
			    $('body').append(chart(chart_data));
			    

				res.end($.html());
			})
		})
		.post();
	
	app.route('/mypolls')
		.get(isLoggedIn, pollHandler.showMyPolls);
		
	app.route('/newpoll')
		.get(isLoggedIn, function(req, res) { res.sendFile(path + '/public/newpoll.html') })
		.post(isLoggedIn, pollHandler.submitPoll);
	
	app.route('/api/all/polls')
		.get(pollHandler.getAllPolls);
		
	app.route('/api/vote/:poll/:option')
		.get(pollHandler.votePoll)
		
	app.route('/api/:id/polls')
		.get(isLoggedIn, pollHandler.getAllPolls);
	//	.post(isLoggedIn, pollHandler.addPost)
	//	.delete(isLoggedIn, pollHandler.removeAllPosts);

};
