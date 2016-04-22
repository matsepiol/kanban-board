var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

Task = require('./models/tasks');

mongoose.connect('mongodb://localhost/kanban-board');
var db = mongoose.connection;

app.get('/', function(req, res) {
  res.send('Kanban board - express server test');
});

app.get('/api/tasks', function(req, res) {
  Task.getTasks(function(err, tasks) {
    if (err) {
      throw err;
    }
    else {
      res.json(tasks);
    }
  });
});

app.listen(3000);
