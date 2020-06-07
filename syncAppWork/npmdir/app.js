var express = require('express');
var app = express();
app.get('/', function (req, res) {
  //res.send('Hello World!');
  
	const SqliteToJson = require('sqlite-to-json');
	const sqlite3 = require('sqlite3');
	const exporter = new SqliteToJson({
	  client: new sqlite3.Database('./formulasDB.db')
	});
	exporter.all(function (err, all) {
	  // all your data here
	  res.send(all);
	});

});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});