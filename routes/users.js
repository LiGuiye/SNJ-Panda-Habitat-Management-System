var express = require('express');
var router = express.Router();
var pgclient =require('dao/pgHelper');

/**
 * 查询列表页
 */
router.get('/', function (req, res, next) {
    //页面跳转时，如果要保留登录信息，需要增加session的传递
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    //查数据库userinfo表并获取表中所有数据
    pgclient.ss('pandainfo','','',function (result) {
        //console.log(result);
        if(result[0]===undefined){
            res.send('没有熊猫信息！');
        }else{
           	//页面跳转时，如果要保留登录信息，需要增加session的传递
            res.render('users', {title: '熊猫信息查询', datas: result,test:res.locals.islogin});
        }
    })
});
router.get('/showrizhi', function (req, res, next) {
    //页面跳转时，如果要保留登录信息，需要增加session的传递
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    //查数据库userinfo表并获取表中所有数据
    pgclient.ss('rizhi','','',function (result) {
        //console.log(result);
        if(result[0]===undefined){
            res.send('没有日志信息！');
        }else{
           	//页面跳转时，如果要保留登录信息，需要增加session的传递
            res.render('showrizhi', {title: '日志信息查询', datas: result,test:res.locals.islogin});
        }
    })
});

/**
 * 增
 */
router.route('/add')
    .get(function(req,res){
        res.render('users_add',{title:'新增熊猫信息'});
    })
    .post(function(req,res) {
        
		pgclient.save('pandainfo',{'id': req.body.id,'weight': req.body.weight,'age': req.body.age,'date': req.body.date}, function (err) {
            pgclient.select('pandainfo',{'id': req.body.id},'', function (result) {
				if(result[0]===undefined){
					res.send('熊猫信息添加未成功，请重新输入');
				}else{
//					res.send('添加成功！');
					res.redirect('/users');
				}
			}); 
        });
    });
router.route('/addrizhi')
    .get(function(req,res){
        res.render('upload');
    })
    .post(function(req,res) {
        
		pgclient.save('rizhi',{'tittle': req.body.tittle,'writter': req.body.writter,'content': req.body.content}, function (err) {
            pgclient.select('rizhi',{'tittle': req.body.tittle},'', function (result) {
				if(result[0]===undefined){
					res.send('日志添加未成功，请重新输入');
				}else{
//					res.send('添加成功！');
					res.redirect('/users/showrizhi');
				}
			}); 
        });
    });
/**
 * 删
 */
router.get('/del/:id', function (req, res) {
    console.log('id:'+req.params.id);
    pgclient.remove('pandainfo',{'id': req.params.id},function(err){
        if (err !='') {
            res.send("熊猫信息删除失败："+err)
        } else {
            res.redirect('/users')
        }
    });
});
router.get('/delrizhi/:tittle', function (req, res) {
    console.log('tittle:'+req.params.tittle);
    pgclient.remove('rizhi',{'tittle': req.params.tittle},function(err){
        if (err !='') {
            res.send("日志信息删除失败："+err)
        } else {
            res.redirect('/users/showrizhi')
        }
    });
});

/**
 * 改
 */
router.get('/toUpdate/:id', function (req, res) {
    //页面跳转时，如果要保留登录信息，需要增加session的传递
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    var id = req.params.id;
    console.log(id);
    pgclient.select('pandainfo',{'id':id},'',function (result) {
        if(result[0]===undefined){
            res.send('熊猫信息修改失败！');
        }else{
            res.render("users_update", {title: '熊猫信息更新', datas: result,test:res.locals.islogin});       //直接跳转,自动补全修改页面的信息
        }
    });
});

/**
 * 改
 */
router.post('/update', function (req, res) {
    var id = req.body.id;
    console.log('id===='+id);
    var age = req.body.age;
    var weight = req.body.weight;
    var date = req.body.date;
	console.log(id+','+age+','+weight+','+date)
    //var professional = req.body.professional;
    pgclient.update('pandainfo',{'id':id},{'age':age,'weight':weight,'date':date},function (err) {
        if (err !='') {
            res.send("熊猫信息修改失败："+err)
        } else {
            res.redirect('/users');
        }
    });
});

/**
 * 查
 */
router.post('/search', function (req, res) {
    //获取页面中搜索框中的用户名参数
    var id = req.body.s_id;
	var age = req.body.s_age;
    //获取页面中搜索框中的电话号码参数
    // var telephone = req.body.s_telephone;
     //页面跳转时，如果要保留登录信息，需要增加session的传递
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    
    //如果姓名和电话都为空，则查询所有信息；
    if(!id&&!age){
        //查数据库userinfo表并获取表中所有数据
        pgclient.select('pandainfo','','',function (result) {
            //console.log(result);
            if(result[0]===undefined){
                res.send('没有熊猫信息！');
            }else{
                //页面跳转时，如果要保留登录信息，需要增加session的传递
                res.render('users', {title: '熊猫查询', datas: result,test:res.locals.islogin});
            }
        })
    }
    if(id&&!age){
        pgclient.select('pandainfo',{'id':id},'',function (result) {
            if(result[0]===undefined){
                res.send('没有熊猫信息！');
            }else{
                res.render("users", {title: '熊猫查询', datas: result,test:res.locals.islogin}); 
            }
        });
    }
	if(age&&!id){
		pgclient.select('pandainfo',{'age':age},'',function (result) {
			if(result[0]===undefined){
				res.send('没有熊猫信息！');
			}else{
				res.render("users", {title: '熊猫查询', datas: result,test:res.locals.islogin}); 
			}
		});
	}
    if(age&&id){
        pgclient.select('pandainfo',{'age':age,'id':id},'',function (result) {
            if(result[0]===undefined){
				
                res.send('没有熊猫信息！');
            }else{
                res.render("users", {title: '熊猫查询', datas: result,test:res.locals.islogin});
            }
        });
    }
    
});
router.post('/searchrizhi', function (req, res) {
    //获取页面中搜索框中的用户名参数
    var tittle = req.body.s_tittle;
	var writter = req.body.s_writter;
    //获取页面中搜索框中的电话号码参数
    // var telephone = req.body.s_telephone;
     //页面跳转时，如果要保留登录信息，需要增加session的传递
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    
    //如果姓名和电话都为空，则查询所有信息；
    if(!tittle&&!writter){
        //查数据库userinfo表并获取表中所有数据
        pgclient.select('rizhi','','',function (result) {
            //console.log(result);
            if(result[0]===undefined){
                res.send('没有日志信息！');
            }else{
                //页面跳转时，如果要保留登录信息，需要增加session的传递
                res.render('showrizhi', {title: '日志查询', datas: result,test:res.locals.islogin});
            }
        })
    }
    if(tittle&&!writter){
        pgclient.select('rizhi',{'tittle':tittle},'',function (result) {
            if(result[0]===undefined){
                res.send('没有日志信息！');
            }else{
                res.render("showrizhi", {title: '日志查询', datas: result,test:res.locals.islogin}); 
            }
        });
    }
	if(writter&&!tittle){
		pgclient.select('rizhi',{'writter':writter},'',function (result) {
			if(result[0]===undefined){
				res.send('没有日志信息！');
			}else{
				res.render("showrizhi", {title: '日志查询', datas: result,test:res.locals.islogin}); 
			}
		});
	}
    if(writter&&tittle){
        pgclient.select('rizhi',{'writter':writter,'tittle':tittle},'',function (result) {
            if(result[0]===undefined){
				
                res.send('没有日志信息！');
            }else{
                res.render("rizhi", {title: '日志查询', datas: result,test:res.locals.islogin});
            }
        });
    }
    
});
module.exports = router;
