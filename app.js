var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');
var flash = require('connect-flash');
//path.join().path.resolve()
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//解析cookie的，req.cookies,属性，存放着客户端提交过来的cookie
//req.cookie(key,value)向客户端写入cookie
var cookieParser = require('cookie-parser');

//写日志的
var logger = require('morgan');
//主页路由
var indexRouter = require('./routes/index');
//用户路由
var usersRouter = require('./routes/users');
//文章的路由
var articlesRouter = require('./routes/articles');

var app = express();
app.set('env',process.env.ENV);//设置生产和开发环境使用的，Linux里设置SET ENV=production
// view engine setup
// 设置模版的存放路径
app.set('views', path.join(__dirname, 'views'));
//设置模版引擎
app.set('view engine', 'html');
//将html渲染成ejs的函数，指定html模版的渲染方法
app.engine('html', require('ejs').__express);
//日志记录中间件
app.use(logger('dev'));
//处理content-type=json的请求体
app.use(express.json());
//处理content-type=urlencoded的请求体extened为true表示用querystring来将请求体的字符串转换成对象
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//处理静态文件服务中间件，指定一个绝对路径，作为当前静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: true,//每次请求结束都要重新保存，不管有没有修改
  saveUninitialized: true,//保存为修改过的session
  secret: 'yang',//加密的秘要
  store: new MongoStore({
      url: config.dbUrl
  })
}));//放在路由前
app.use(flash());
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  res.locals.keyword = req.session.keyword;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
// 捕获404错误，并转发到错误处理中间件
app.use(function(req, res, next) {
  next(createError(404));
});
//开发时错误处理
//将打印出错误的堆栈信息
// error handler
// 错误处理中间件有四个参数，第一个参数是错误对象
// 如果有中间件出错了，会把请求交给错误请求中间件来处理
// 生产环境下的错误处理
// 不向用户暴漏的信息，隐藏错误对象，error:{}
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //设置状态码，默认500
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
