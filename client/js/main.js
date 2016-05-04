'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTask = exports.fetchTask = exports.Api = undefined;

var _api = require('./api.js');

var Api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var tasks = void 0,
    taskTpl = void 0;

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
  var typeSection = document.getElementsByClassName(task.type)[0],
      errMsg = 'Required fields are missing.',
      okMsg = 'Everything went fine!';

  if (!task.name || !task.author || !task.type) {
    return errMsg;
  } else {
    if (!typeSection) return;
    var taskHtml = taskTpl(task),
        currentTask = document.createElement('div');

    currentTask.setAttribute('data-taskid', task._id);
    currentTask.classList.add('task');
    currentTask.innerHTML = taskHtml;
    typeSection.appendChild(currentTask);
    return okMsg;
  }
};

function addTask(options) {
  var promise = new Promise(function (resolve, reject) {
    Api.addTask(options, function (task) {
      toggleDialog();
      fetchTask(JSON.parse(task));
      return "Task succesfully added.";
    });
  });
};

window.toggleDialog = function () {
  var dialog = document.getElementsByClassName('add-task-dialog')[0],
      inputs = document.getElementsByClassName('properties')[0].getElementsByTagName('input');

  if (dialog.classList.contains('hidden')) {
    dialog.classList.remove('hidden');
  } else {
    dialog.classList.add('hidden');

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
  }
};

window.getNewTaskOptions = function () {
  var taskName = document.getElementsByClassName('name-input')[0].getElementsByTagName('input')[0].value,
      taskAuthor = document.getElementsByClassName('author-input')[0].getElementsByTagName('input')[0].value,
      taskDesc = document.getElementsByClassName('description-input')[0].getElementsByTagName('input')[0].value,
      typeCheckbox = document.getElementsByClassName('task-type-form')[0].getElementsByTagName('input'),
      taskType = void 0;

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

window.deleteTask = function (obj) {
  var taskEl = obj.parentElement,
      taskId = taskEl.getAttribute('data-taskid');

  var promise = new Promise(function (resolve, reject) {
    Api.deleteTask(taskId, function (task) {
      taskEl.parentElement.removeChild(taskEl);
      return "Task succesfully deleted.";
    });
  });
};

exports.Api = Api;
exports.fetchTask = fetchTask;
exports.addTask = addTask;