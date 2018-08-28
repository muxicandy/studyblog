var express = require('express');
//调用一个路由的实例
var router = express.Router();
var markdown = require('markdown').markdown;
var models = require('../models');

/* GET home page. */
// path指定路径
// listener指定监听函数
router.get('/', function(req, res, next) {
	//先查找，然后把user转换成user对象
	// models.Article.find({}).populate('user').;
	// });
	let keyword= req.query.keyword;
	let search= req.query.search;
	let pageNum = req.query.pageNum || 1;
	let pageSize = req.query.pageSize || 2;
	let queryObj = {};
	if (search) {
		req.session.keyword = keyword;//keyword从session中取就可以了
	}
	keyword = req.session.keyword;
	let reg = new RegExp(keyword,'i');
	queryObj= {$or:[{title:reg},{content:reg}]};
	models.Article.find(queryObj).skip((pageNum - 1)*pageSize).limit(pageSize).populate('user').exec(function(err, articles){
		articles.forEach(function(article){
			article.content = markdown.toHTML(article.content);
		});
		models.Article.count(queryObj,function(err, count){
			res.render('index', {
				articles: articles,
				totalPage: Math.ceil(count / pageNum),
				keyword: keyword,
				pageNum: pageNum,
				pageSize: pageSize
			});
		});
	});
});

module.exports = router;
