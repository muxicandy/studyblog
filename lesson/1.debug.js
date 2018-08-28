//这是一个日志记录器，用于向控制台输出日志
let debug = require('debug');
//错误 名字叫：studyblog:error
let error_debug = ('studyblog:error');
error_debug('error');//DEBUG这个变量
//当项目出现警告的时候输出的日志
let warn_debug = ('studyblog:warn');
warn_debug('warn');
//调试日志，开发的时候需要看到的
let log_debug = ('studyblog:log');
log_debug('log');