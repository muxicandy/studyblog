let crypto = require('crypto');

/*
	1.不同的输入一定会产生不同的输出
	2.形同的输入一定会产生相同的输出
	3.从输出的摘要中不可能推算出原始的输入的值
 */

let md5 = crypto.createHash('md5');
let result =md5.update('1').update('2').digest('hex');

console.log(result);