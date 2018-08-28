let express = require('express');
//路由的实例
let router = express.Router();
let util = require('../util');
let auth = require('../middleWare/auth');

let models = require('../models');
/* GET users listing. 注册*/
router.get('/reg',auth.checkNotLogin, function(req, res, next) {
	res.render('./user/reg',{title: '注册'});
});

router.post('/reg',auth.checkNotLogin,function(req,res,next){
	//保存对象有两种方法，model.create;entity.save
	let user = req.body;
	if (user.password != user.repassword) {
		req.flash('error','用户注册失败');
		res.redirect('back');
	} else {
		req.body.password = util.md5(req.body.password);
			//增加一个头像图片
		req.body.avator = "https://secure.gravatar.com/avatar/"+util.md5(req.body.email)+"?s=48";
		console.log(req.body,'req.body===');
		models.User.create(req.body, function (err,doc) {
			req.flash('success','用户注册成功');
			res.redirect('/users/login');
		});
	}
});
router.get('/login',auth.checkNotLogin, function(req, res, next) {
	res.render('./user/login',{title: '登陆'});
});
router.post('/login', auth.checkNotLogin,function(req,res,next){
	req.body.password = util.md5(req.body.password);
	models.User.findOne({username:req.body.username,password:req.body.password},function(err,doc){
		if (err) {
			req.flash('error','用户登录失败');
			res.redirect('back');
		} else {
			if (doc) {//如果有值表示找到了对应的用户，表示登陆成功了
				//如果登陆成功后，把查询到的user用户赋给session属性
				req.flash('success','用户登陆成功');
				req.session.user = doc;
				res.redirect('/');
			} else {//找不到表示登陆失败
				req.flash('error','用户登录失败');
				res.redirect('back')
			}
		}
	});
});
router.get('/logout',auth.checkLogin, function(req, res, next) {
	req.session.user = null;
	req.flash('success','用户退出成功');
	res.redirect('/');
});
module.exports = router;
