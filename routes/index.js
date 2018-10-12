var passport	= require('passport');
var Promise 	= require('bluebird');
var Profile		= require('../models/profiles');
var sql				= require('mssql');
var JSONStringify = require('streaming-json-stringify');

var Sequelize = require('sequelize');
var SequelizeAuto = require('sequelize-auto');
var moment = require('moment');

//The following file isn't included and needs to be created
//Example below
/*
var config = {};
config.sqlstring = {
		user: '',
		password: '',
		server: '',
		database: '',
		connectionString: '',
		driver: 'tedious',
		pool: {
				max: 10,
				min: 0,
				idleTimeoutMillis: 30000
		},
		options: {
				database: ''
		}
}
module.exports = config;
*/

var config		= require('../config/config.js');

//if(config.sqlstring.database!= ''){
var sequelize = new Sequelize(config.sqlstring.database, config.sqlstring.user, config.sqlstring.password, {
	host: config.sqlstring.server,
	port: 1433,
	dialect: 'mssql',

	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define: {
				timestamps: false
		},
	logging: false
});
//}
var config2 = {
	user: config.sqlstring.user,
	//userName: config.sqlstring.user,
	connectionString: config.sqlstring.connectionString,
	password: config.sqlstring.password,
	server: '94.103.159.131',
	database: config.sqlstring.database,
	host: config.sqlstring.server,
	port: 1437,
	dialect: 'mssql',
	driver: 'tedious'
};

var auto = new SequelizeAuto(config.sqlstring.database, config.sqlstring.user, config.sqlstring.password, {
	host: config.sqlstring.server,
	port: 1437,
	dialect: 'mssql',
	tables: ['RegisteredServer','RemoteQueuedMetric'],
	schema: ['axerrio','dbo'],
	directory: './models',
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	additional: {
		timestamps: false
	}
})

exports.index = function(req, res){
	res.render('index');
	// res.render('index_semanticui');
}

/*
== ABS
==========================================
*/

exports.packing2018 = function(req, res) {
	if(config.sqlstring.database!= ''){
	sequelize.query("exec [Reporting].[axspInfoScreenPacking2018] :topRows,:transportType,:daysAhead,:daysIncluded",
	{replacements: {
		topRows: req.params.topRows,
		transportType: req.params.transportType,
		daysAhead: req.params.daysAhead,
		daysIncluded: req.params.daysIncluded
	}}
	,{raw: true,type: sequelize.QueryTypes.SELECT})
	.then(result => {
		res.status(200).send(result[0]);
	})
	.catch(err => {
		console.log(err);
	});
}
}
/*
== MISC
==========================================
*/

exports.partial = function (req, res) {
	var name = req.params.name;
	var sub = req.params.sub
	res.render('partials/'+ sub + '/' + name);
}

exports.register = function(req, res) {
	Profile.register(new Profile({
				username:           req.body.username,
				firstname:          req.body.firstname,
				lastname:           req.body.lastname,
				skills:             req.body.skills
	}),
		req.body.password, function(err, account) {
		if (err) {
			return res.status(500).json({
				err: err
			});
		}
		passport.authenticate('local')(req, res, function () {
			return res.status(200).json({
				status: 'Registration successful!'
			});
		});
	});
}

exports.login = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(500).json({
					err: 'Could not log in user'
				});
				//console.log('Could not log in user ',user);
			}
			res.status(200).json({
				status: 'Login successful!'
			});
			//console.log('Login successful! ',user);
		});
	})(req, res, next);
}

exports.logout = function(req, res) {
	req.logOut();
	req.session.destroy();
	// store.destroy(req.sessionID, err)
	// if(err) res.status(500).json({ err: 'Something went wrong deleting your session' });
	res.status(200).json({
		status: 'Bye!'
	});
}

exports.status = function(req, res) {
	if (!req.isAuthenticated()) {
		return res.status(200).json({
			status: false
		});
	}
	//console.log(req.user);
	res.status(200).json({
		status: true,
		user: {username: req.user.username, // only username, safer
		id: req.user._id}
	});
}
