'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PostHandler = require(path + '/app/controllers/postHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var postHandler = new PostHandler();

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
		
	app.route('/polls/:id')
		.get()
		.post();
	
	app.route('/mypolls')
		.get();
		
	app.route('/newpoll')
		.get()
		.post();
		
	app.route('/api/:id/posts')
		.get(isLoggedIn, postHandler.getPosts)
		.post(isLoggedIn, postHandler.addPost)
		.delete(isLoggedIn, postHandler.removeAllPosts);
};
