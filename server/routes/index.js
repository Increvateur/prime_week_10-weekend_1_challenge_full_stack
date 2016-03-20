var express = require("express");
var router = express.Router();
var path = require("path");
var pg = require("pg");

var connectionString = '';

if (process.env.DATABASE_URL !== undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/weekend_challenge_1_update';
}

router.post('/employees', function(req, res) {
  console.log('Received req body:', req.body);
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var start = client.query('CREATE TABLE IF NOT EXISTS employees' +
    '(id SERIAL NOT NULL, firstname character varying(255) NOT NULL,' +
    'lastname character varying(255) NOT NULL, employeeid character varying(255) NOT NULL,' +
    'jobtitle varchar(255) NOT NULL, salary varchar(100) NOT NULL, status varchar(7) NOT NULL,' +
    'CONSTRAINT employees_pkey PRIMARY KEY (id))');

    var query = client.query('INSERT INTO employees (firstname, lastname, employeeid, jobtitle, salary, status) VALUES ($1, $2, $3, $4, $5, $6)' +
                             'RETURNING id, firstname, lastname, employeeid, jobtitle, salary, status',
                             [req.body.firstname, req.body.lastname, req.body.employeeid, req.body.jobtitle, req.body.salary, req.body.status]);

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get('/employees', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('SELECT * FROM employees');

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname, "../public/", file));
});

module.exports = router;
