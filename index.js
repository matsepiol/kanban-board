var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

var Task = require('./models/tasks');

mongoose.connect('mongodb://localhost/kanban-board');
var db = mongoose.connection;

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

app.get('/api/tasks/:_id', function(req, res) {
  Task.getTaskById(req.params._id, function(err, task) {
    if (err) {
      throw err;
    }
    else {
      res.json(task);
    }
  });
});

app.post('/api/tasks', function(req, res) {
  var task = req.body;
  Task.addTask(task, function(err, task) {
    if (err) {
      throw err;
    }
    else {
      res.json(task);
    }
  });
});

app.put('/api/tasks/:_id', function(req, res) {
  var id = req.params._id;
  var task = req.body;
  Task.editTask(id, task, {new: true}, function(err, task) {
    if (err) {
      throw err;
    }
    else {
      res.json(task);
    }
  });
});

app.delete('/api/tasks/:_id', function(req, res) {
  var id = req.params._id;
  Task.deleteTask(id, function(err, task) {
    if (err) {
      throw err;
    }
    else {
      res.json(task);
    }
  });
});

app.listen(3000);
