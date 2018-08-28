let express = require('express');
let router = express.Router();
let auth = require('../middleWare/auth');
let models = require('../models');
let multer = require('multer');

var storage = multer.diskStorage({
	//	目标路径
	  destination: function (req, file, cb) {
	    cb(null, 'public/uploads')
	  },
	  //文件名
	  filename: function (req, file, cb) {
	  	console.log(file);
	    cb(null,Date.now() + '.' + (file.mimetype.slice(file.mimetype.indexOf('/')+1)));
	  }
});

var upload = multer({ storage: storage });

router.get('/port',auth.checkLogin, function(req, res, next){
	res.render('./article/add',{title: '发表文章'});
});
router.post('/add',auth.checkLogin, upload.single('poster'), function(req,res,next){
	let article = req.body;
	if (req.file){
		article.poster = '/uploads/'+req.file.filename;
	}
	//把当前登录用户的id赋给user
	article.user = req.session.user._id;
	models.Article.create(article,function(err,doc){
		if (err) {
			req.flash('error', '文章发表失败');
		} else {
			req.flash('success', '文章发表成功');
			res.redirect('/');
		}
	});
});
module.exports = router;