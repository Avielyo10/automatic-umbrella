var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Your password here'
});

var qDB = "CREATE DATABASE IF NOT EXISTS my_db;";
var qtable = "CREATE TABLE IF NOT EXISTS `records` ( \
        `hour` int(2) NOT NULL default -1, \
        `username` varchar(255) NOT NULL default '', \
        `favoriteTopic` varchar(255) NOT NULL default '' \
        );";

// create a server object:
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    
    if (q.pathname == '/SaveToDB'){
        var qData = q.query;
        var uName = qData.UserName;
        var uTopic = qData.UserFavoriteTopic;
        var myQuery = "INSERT INTO `records` VALUES ("
            + new Date().getHours() + ",'" 
            + uName + "','" 
            + uTopic + "');"

        if (uName){
            connection.connect(function(err) {
                err ? console.log("Already Connected ..") : console.log("Connected!");

                connection.query(qDB, function (err, result) {
                    if (err) throw err;
                    console.log("Database my_db created");
                });
                connection.query("USE my_db;", function (err, result){
                    if (err) throw err;
                    console.log("Using my_db");
                });
                connection.query(qtable, function (err, result){
                    if (err) throw err;
                    console.log("Table `records` created!");
                });
                connection.query(myQuery, function (err, result){
                    if (err) {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        return res.end('<h1>An error occurred while trying to save to DB</h1>');
                    }
                    console.log("Saved into DB!");
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    return res.end('<h1>Saved into DB!</h1>');
                });
            });
        }
        else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end('<h1>An error occurred while trying to save to DB</h1>');
        }
    }
    else {
        fs.readFile(filename, function(err, data) {
            if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("<h1>404 Not Found</h1>");
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
}).listen(8080);