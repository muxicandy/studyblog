let mongoose = require('mongoose');
let config = require('../config');
let typeObj = mongoose.Schema.Types.ObjectId;
mongoose.connect(config.dbUrl,{useNewUrlParser:true});

exports.User = mongoose.model('user', new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	avator: String
}));

exports.Article = mongoose.model('article', new mongoose.Schema({
	user:{type:typeObj,ref:'user'},
	title: String,
	content: String,
	poster: String,
	createAt: {type:Date,default:Date.now()}
}));