var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
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
}