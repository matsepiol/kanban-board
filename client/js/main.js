'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTask = exports.fetchTask = exports.Api = undefined;

var _api = require('./api.js');

var Api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var tasks = void 0;
var taskTpl = void 0;

getTemplate().then(function (data) {
  //get hbs template
  taskTpl = Handlebars.compile(data);
  getTasks().then(function (tasks) {
    //get tasks from API
    for (var i = 0; i < tasks.length; i++) {
      fetchTask(tasks[i]);
    }
  });
});

function getTasks() {
  var promise = new Promise(function (resolve, reject) {
    Api.getTasks(function (tasks) {
      resolve(JSON.parse(tasks));
    });
  });
  return promise;
};

function getTemplate() {
  var promise = new Promise(function (resolve, reject) {
    var http = new XMLHttpRequest();

    http.open("GET", '../handlebars/taskTpl.hbs', true);
    http.send(null);

    http.onreadystatechange = function (e) {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText);
      }
    };

    http.onerror = function (e) {
      reject(e);
    };
  });

  return promise;
};

function fetchTask(task) {
  var errMsg = 'Required fields are missing.',
      okMsg = 'Everything went fine!';

  if (!task.name || !task.author || !task.type) {
    return errMsg;
  } else {
    var taskType = document.getElementsByClassName(task.type)[0];
    //let taskHtml = taskTpl(task);
    //console.log(taskHtml);
    return okMsg;
  }
};

function addTask(options) {
  var promise = new Promise(function (resolve, reject) {
    Api.addTask(options, function (task) {
      toggleDialog();
      return "Task succesfully added.";
    });
  });
};

window.toggleDialog = function () {
  var dialog = document.getElementsByClassName('add-task-dialog')[0];

  if (dialog.classList.contains('hidden')) {
    dialog.classList.remove('hidden');
  } else {
    dialog.classList.add('hidden');
    var inputs = document.getElementsByClassName('properties')[0].getElementsByTagName('input');

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
  }
};

window.getNewTaskOptions = function () {
  var taskName = document.getElementsByClassName('name-input')[0].getElementsByTagName('input')[0].value,
      taskAuthor = document.getElementsByClassName('author-input')[0].getElementsByTagName('input')[0].value,
      taskDesc = document.getElementsByClassName('description-input')[0].getElementsByTagName('input')[0].value,
      taskType = void 0;

  var typeCheckbox = document.getElementsByClassName('task-type-form')[0].getElementsByTagName('input');
  for (var i = 0; i < typeCheckbox.length; i++) {
    if (typeCheckbox[i].checked) {
      taskType = typeCheckbox[i].value;
    }
  }

  var taskObject = {
    name: taskName,
    author: taskAuthor,
    type: taskType,
    description: taskDesc
  };

  addTask(taskObject);
};

exports.Api = Api;
exports.fetchTask = fetchTask;
exports.addTask = addTask;