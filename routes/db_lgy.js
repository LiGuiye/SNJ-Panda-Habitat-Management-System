//此处为封装的数据库查询函数

var promise = require('bluebird');
var options = {
	// Initialization Options
	promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:313616@127.0.0.1:5432/shennongjia';
var db = pgp(connectionString);

// add query functions
function getAllPlayers(req, res, next) {
	db.any('select * from c584_poem')
		.then(function(data) {
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved ALL players'
				});
		})
		.catch(function(err) {
			return next(err);
		});
}

function selectpoet(name, req, res) {
	db.any('select * from c584_poet where poetname ~* $1', name)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
		})
		.catch(function(err) {
			res.json({
				name: "搜不到",
				dynasty: '<br/>',
				introduction: "搜不到",
				creations: ""
			})
			console.log("搜不到");
		});
}

function selectall(req, res) {
	db.any('select * from precipitation')
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
		})
		.catch(function(err) {
			res.json({
				data: "搜不到"
			})
			console.log(table);
		})

}
function selectyearmonth(year,month,req, res) {
	console.log("year:::"+year);
	console.log("month:::"+month);
	db.any('select * from historicalweather where year = $1 and month = $2',[year,month])
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
		})
		.catch(function(err) {
			return next(err);
		});

}
function selectmonthday(month,day,req, res) {
	console.log("year:::"+month);
	console.log("month:::"+day);
	db.any('select * from historicalweather where month = $1 and day = $2',[month,day])
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
		})
		.catch(function(err) {
			return next(err);
		});

}
function selectall_protectionline_pilepoint(req, res) {
	db.any('select * from protectionline_pilepoint order by id')
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
		})
		.catch(function(err) {
			res.json({
				data: "搜不到"
			})
			console.log(table);
		})

}




function getSinglePlayer(req, res, next) {
	var playerID = parseInt(req.params.id);
	db.one('select * from c584_poem where poemid = $1', playerID)
		.then(function(data) {
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved ONE Player'
				});
		})
		.catch(function(err) {
			return next(err);
		});
}




function createPlayer(req, res, next) {
	console.log(req.query);
	db.none('insert into player(name, surname, dob) values (${name}, ${surname}, ${dob})', req.query)
		.then(function() {
			res.status(200)
				.json({
					status: 'success',
					message: 'Inserted one player'
				});
		})
		.catch(function(err) {
			return next(err);
		});
}

function updatePlayer(req, res, next) {
	console.log(req.query);
	db.none('update player set name=$1, surname=$2, dob=$3 where id=$4', [req.query.name, req.query.surname, req.query.dob, parseInt(req.params.id)])
		.then(function() {
			res.status(200)
				.json({
					status: 'success',
					message: 'Updated player'
				});
		})
		.catch(function(err) {
			return next(err);
		});
}

function deletePlayer(req, res, next) {
	var playerId = parseInt(req.params.id);
	db.result('delete from player where id = $1', playerId)
		.then(function(result) {
			/* jshint ignore:start */
			res.status(200)
				.json({
					status: 'success',
					message: `Removed ${result.rowCount} player`
				});
			/* jshint ignore:end */
		})
		.catch(function(err) {
			return next(err);
		});
}

module.exports = {
	getAllPlayers: getAllPlayers,
	getSinglePlayer: getSinglePlayer,
	createPlayer: createPlayer,
	updatePlayer: updatePlayer,
	deletePlayer: deletePlayer,
	selectpoet: selectpoet,
	selectall: selectall,
	selectall_protectionline_pilepoint:selectall_protectionline_pilepoint,
	selectyearmonth:selectyearmonth,
	selectmonthday:selectmonthday
};