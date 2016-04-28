var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    require: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

var Task = module.exports = mongoose.model('Task', taskSchema);

//get tasks
module.exports.getTasks = function(callback, limit) {
  Task.find(callback).limit(limit);
};

//get task by id
module.exports.getTaskById = function(id, callback) {
  Task.findById(id, callback);
};

//add task
module.exports.addTask = function(task, callback) {
  Task.create(task, callback);
};

//edit task
module.exports.editTask = function(id, task, options, callback) {
  var query = {_id: id},
      update = {};

  if (task.name) update.name = task.name;
  if (task.author) update.author = task.author;
  if (task.type) update.type = task.type;
  if (task.description) update.description = task.description;

  Task.findOneAndUpdate(query, update, options, callback);
};

//delete task
module.exports.deleteTask = function(id, callback) {
  var query = {_id: id};

  Task.remove(query, callback);
};