exports.checkLogin = function(req,res,next) {
	let user = req.session.user;
	if (user) {
		next();
	} else {
		req.flash('error', '登陆后才能使用');
		res.redirect('/users/login');
	}
}

exports.checkNotLogin = function(req,res,next) {
	let user = req.session.user;
	if (user) {
		req.flash('error', '登陆前才能使用');
		res.redirect('/');
	} else {
		next();
	}
}