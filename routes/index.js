var express = require('express');
var router = express.Router();
var pgclient = require('dao/pgHelper');
pgclient.getConnection();
var db_lgy = require('./db_lgy');
//var cors = require('cors');
//router.use(cors());

/* GET home page. */
router.get('/', function(req, res) {
	if (req.cookies.islogin) {
		req.session.islogin = req.cookies.islogin;
	}
	if (req.session.islogin) {
		res.locals.islogin = req.session.islogin;
	}
	res.render('index', {
		title: 'HOME',
		test: res.locals.islogin
	});
});
router.get('/ChangeMarker', function(req, res, next) {
	if(req.cookies.islogin){
		req.session.islogin=req.cookies.islogin;
	}
	if(req.session.islogin){
		res.locals.islogin=req.session.islogin;
	}
	//查数据库userinfo表并获取表中所有数据
	pgclient.select('userinfo','','',function (result) {
		//console.log(result);
		if(result[0]===undefined){
			res.send('没有用户信息！');
		}else{
			//页面跳转时，如果要保留登录信息，需要增加session的传递
			res.render('ChangeMarker', {title: '用户管理', datas: result,test:res.locals.islogin});
		}
	})
});

router.get('/PandaManagement', function(req, res) {
	res.render('PandaManagement');
});
router.get('/emergency', function(req, res) {
	res.render('emergency');
});
router.get('/weekweather', function(req, res) {
	res.render('weekweather');
});
// router.get('/upload', function(req, res) {
// 	res.render('upload');
// });
router.get('/precipitation', function(req, res) {

	res.render('MyEcharts');
});
router.get('/PrecipitationEcharts', function(req, res) {

	res.render('PrecipitationEcharts');
});
router.get('/PrecipitationEcharts_yearcomparison', function(req, res) {

	res.render('PrecipitationEcharts_yearcomparison');
});
router.get('/ndvi1998', function(req, res) {
	res.render('ndvi1998');
});
router.get('/ndvi2016', function(req, res) {
	res.render('ndvi2016');
});
router.get('/ndvi1998', function(req, res) {
	res.render('ndvi1998');
});
router.get('/contourline21', function(req, res) {
	res.render('contourline21');
});
router.get('/contourline22', function(req, res) {
	res.render('contourline22');
});
router.get('/contourline23', function(req, res) {
	res.render('contourline23');
});
router.get('/contourline24', function(req, res) {
	res.render('contourline24');
});
router.get('/dem', function(req, res) {
	res.render('dem');
});

router.get('/PrecipitationMonth', function(req, res) {
	var month = req.query.month;
	pgclient.select('precipitation', {
		'month': req.query.month
	}, '', function(data) {
		if (data[0] === undefined) {
			res.send('返回空值');
		} else {
			res.status(200)
				.json({
					data: data
				});
		}
	});


});


router.get('/PrecipitationYearMonth', function(req, res) {
	var month = req.query.month;
	var year = req.query.year;

	db_lgy.selectyearmonth(year,month,req,res);

});
router.get('/PrecipitationMonthDay', function(req, res) {
	var month = req.query.month;
	var day = req.query.day;

	db_lgy.selectmonthday(month,day,req,res);

});


router.get('/introduce', function(req, res) {
	res.render('introduce');
});
router.get('/background', function(req, res) {
	res.render('background');
});
router.get('/goal', function(req, res) {
	res.render('goal');
});
router.get('/vector', function(req, res) {
	res.render('vector');
});
router.get('/location', function(req, res) {
	res.render('location');
});
router.route('/login')
	.get(function(req, res) {
		if (req.session.islogin) {
			res.locals.islogin = req.session.islogin;
		}

		if (req.cookies.islogin) {
			req.session.islogin = req.cookies.islogin;
		}
		res.render('login', {
			title: '用户登录',
			test: res.locals.islogin
		});
	})
	.post(function(req, res) {

		result = null;
		pgclient.select('userinfo', {
			'name': req.body.username
		}, '', function(result) {
			if (result[0] === undefined) {
				res.send('没有该用户');
			} else {
				if (result[0].password === req.body.password) {
					req.session.islogin = req.body.username;
					res.locals.islogin = req.session.islogin;
					res.cookie('islogin', res.locals.islogin, {
						maxAge: 600000
					});
					res.redirect('/');
				} else {
					res.redirect('/login');
				}
			}
		});
	});

router.get('/logout', function(req, res) {
	res.clearCookie('islogin');
	req.session.destroy();
	res.redirect('/');
});

router.route('/reg')
	.get(function(req, res) {
		res.render('reg', {
			title: '注册'
		});
	})
	.post(function(req, res) {

		pgclient.save('userinfo', {
			'name': req.body.username,
			'password': req.body.password2
		}, function(err) {
			pgclient.select('userinfo', {
				'name': req.body.username
			}, '', function(result) {
				if (result[0] === undefined) {
					res.send('注册没有成功请，重新注册');
				} else {
					req.session.islogin = req.body.username;
					res.locals.islogin = req.session.islogin;
					res.cookie('islogin', res.locals.islogin, {
						maxAge: 600000
					});
					res.redirect('/');
				}
			});
		});
	});

module.exports = router;
