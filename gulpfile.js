var stream = require('stream'),
    fs = require('fs'),
    path = require('path'),

    gulp = require('gulp');

var child_process = require('child_process');

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

var lastMessage = '';
setInterval(function(){
    var connection = mysql.createConnection(mysql_config);
    connection.connect();

    connection.query('select * from sqltoollog', function (error, results, fields) {
	if(lastMessage == results[0].message)
	    return;
	
	if(error)
	    console.log(error.sqlMessage);
	else
	    console.log(results[0].message);
	lastMessage = results[0].message;
	connection.end();    
    });    
}, 3000);

//gulp.task('default', [], function(arg){
    gulp.watch(pathToSqlDirectory + '**/**/*.sql', function(event){
	child_process.exec('mysql -u ' + mysql_config.user + ' -p' + mysql_config.password + ' ' + mysql_config.database + ' < ' + event.path, (err, stdout, stderr) => {
	    if (err) {
		console.log(err);
		// node couldn't execute the command
		return;
	    }

	    // the *entire* stdout and stderr (buffered)
	    console.log(`stdout: ${stdout}`);
	    console.log(`stderr: ${stderr}`);
	});
	/*	var connection = mysql.createConnection(mysql_config);
	var query = fs.readFileSync(event.path).toString();
	connection.connect();

	console.log(query);
	connection.query(query, function (error, results, fields) {
	    if(error)
		console.log(error.sqlMessage);
	    else
		console.log(JSON.stringify(results, null, 4));
	    connection.end();    
	});*/
	
    });

//});

//gulp.runTask('default');
