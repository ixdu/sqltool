var stream = require('stream'),
    fs = require('fs'),
    path = require('path'),

    gulp = require('gulp');

var pathToSqlDirectory = "./";

var mysql = require('mysql');

var mysql_config = {
    host     : '192.168.56.107',
    user     : 'root',
    password : '32167',
    port : '3306',
    database : 'myenterprise',
    multipleStatements: true
};

gulp.task('default', [], function(arg){
    gulp.watch(pathToSqlDirectory + '**/**/*.sql', function(event){
	var connection = mysql.createConnection(mysql_config);
	var query = fs.readFileSync(event.path).toString();
	connection.connect();

	console.log(query);
	connection.query(query, function (error, results, fields) {
	    if(error)
		console.log(error.sqlMessage);
	    else
		console.log(JSON.stringify(results, null, 4));
	    connection.end();    
	});
	
    });

});
