// app/routes.js
// IMPORTING THE NECESSARY PACKAGES -----------
const path    = require('path');
const express = require('express');
const jwt     = require('jsonwebtoken');


module.exports = (app, passport) => {
	app.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname, '..', 'public', 'html', 'index.html'));
	});

	app.post('/hello', (req, res) => {
		res.send({success: false});
	});

	app.post('/signup', (req, res) => {

		passport.authenticate('local-signup', (err, user, info) => {
			if(err) {
				return res.status(500).json({ message: 'Service Unavailable'});
			}
			if(!user) {
				return res.status(401).json({ success: false,user: false });
			}
			let token = jwt.sign(user, app.get('superSecret'), {
				expiresIn: '1h'
			});

			// return the information including token as JSON
			res.status(200).json({
				success: true,
				token: token
			});

		})(req, res);

	});

	app .post('/login', (req, res) => {
		passport.authenticate('local-login', (err, user, info) => {

			if(err) {
				return res.status(500).json({ message: 'Service Unavailable'});
			}
			if(!user) {
				if(!info.user) {
					return res.status(401).json({ success: false, user: false});
				}
				if(info.user && !info.password) {
					return res.status(401).json({ success: false, user: false});
				}
			}
			else {
				let token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: '1h'
				});

				res.status(200).json({
					success: true,
					token: token
				});
			}
		})(req, res);
	});

	/*let apiRoutes = express.Router()
	
	apiRoutes.use((req, res, next) => {
		let token  = req.body.token || req.query.token || req.headers['x-access-token'];

		if(token) {

			jwt.verify(token, app.get('superSecret'), (err, decoded) => {
				if(err) {
					return res.json({success: false, error: true, message: err });
				}
				req.decoded = decoded;
				return next();
			});
		}
		else {
			return res.json({ success: false, token: false});
		}
	});

	apiRoutes.get('/', (req, res) => {
		res.json(req.decoded._doc);
	});*/
};