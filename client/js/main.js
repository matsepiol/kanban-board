'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editTask = exports.toggleDialog = exports.addTask = exports.fetchTask = exports.Api = undefined;

var _api = require('./api.js');

var Api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var tasks = void 0,
    taskTpl = void 0,
    isEditing = false,
    taskId = void 0;

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
}

function getTemplate() {
  var promise = new Promise(function (resolve, reject) {
    var http = new XMLHttpRequest();

    http.open('GET', '../handlebars/taskTpl.hbs', true);
    http.send(null);

    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText);
      }
    };

    http.onerror = function (e) {
      reject(e);
    };
  });

  return promise;
}

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
}

function addTask(options) {
  var promise = new Promise(function (resolve, reject) {
    Api.addTask(options, function (task) {
      fetchTask(JSON.parse(task));
      return 'Task succesfully added.';
    });
  });
  toggleDialog();
}

function editTask(taskId, taskObj) {
  var promise = new Promise(function (resolve, reject) {
    Api.editTask(taskId, taskObj, {}, function (task) {
      updateTask(JSON.parse(task));

      //end of editing
      isEditing = false;
    });
  });

  toggleDialog();
}

function updateTask(task) {
  var taskEl = document.querySelectorAll('[data-taskid="' + task._id + '"]')[0],
      formerType = taskEl.closest('.board').classList[1];

  // if changed task type - move task to different board
  if (formerType !== task.type) {
    taskEl.parentElement.removeChild(taskEl);
    fetchTask(task);
  } else {
    taskEl.getElementsByClassName('task-name')[0].textContent = task.name;
    taskEl.getElementsByClassName('task-author')[0].textContent = task.author;
    taskEl.getElementsByClassName('task-desc')[0].textContent = task.description;
  }
}

window.toggleDialog = function (taskObj) {
  var dialog = document.getElementsByClassName('add-task-dialog')[0],
      inputs = document.getElementsByClassName('properties')[0].getElementsByTagName('input'),
      editTitle = 'Edit Task',
      addTaskTitle = 'Add New Task';

  if (dialog.classList.contains('hidden')) {
    dialog.classList.remove('hidden');
  } else {
    dialog.classList.add('hidden');

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
  }

  var titleEl = document.getElementsByClassName('add-task-dialog')[0].getElementsByTagName('h2')[0];
  //while editing
  if (taskObj) {
    var taskName = taskObj.taskName;
    var taskAuthor = taskObj.taskAuthor;
    var taskDesc = taskObj.taskDesc;
    var taskType = taskObj.taskType;

    document.getElementsByClassName('name-input')[0].getElementsByTagName('input')[0].value = taskName;
    document.getElementsByClassName('author-input')[0].getElementsByTagName('input')[0].value = taskAuthor;
    document.getElementsByClassName('description-input')[0].getElementsByTagName('input')[0].value = taskDesc;
    document.getElementById(taskType).checked = true;
    titleEl.innerHTML = editTitle;
  }
  //while creating new task
  else {
      titleEl.innerHTML = addTaskTitle;
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

  //all fields must be filled
  // TODO - visible alert that you haven't filled all inputs
  if (!taskName || !taskAuthor || !taskDesc) return;

  var taskObject = {
    name: taskName,
    author: taskAuthor,
    type: taskType,
    description: taskDesc
  };

  if (isEditing) {
    editTask(taskId, taskObject);
  } else {
    addTask(taskObject);
  }
};

window.deleteTask = function (obj) {
  var taskEl = obj.parentElement,
      taskId = taskEl.getAttribute('data-taskid');

  var promise = new Promise(function (resolve, reject) {
    Api.deleteTask(taskId, function (task) {
      taskEl.parentElement.removeChild(taskEl);
      return 'Task succesfully deleted.';
    });
  });
};

window.showEditDialog = function (obj) {
  var taskEl = obj.parentElement,
      taskObj = {
    taskName: taskEl.getElementsByClassName('task-name')[0].textContent,
    taskAuthor: taskEl.getElementsByClassName('task-author')[0].textContent,
    taskDesc: taskEl.getElementsByClassName('task-desc')[0].textContent,
    taskType: taskEl.closest('.board').classList[1]
  };

  taskId = taskEl.getAttribute('data-taskid');
  isEditing = true;
  toggleDialog(taskObj);
};

exports.Api = Api;
exports.fetchTask = fetchTask;
exports.addTask = addTask;
exports.toggleDialog = toggleDialog;
exports.editTask = editTask;