'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchTask = exports.Api = undefined;

var _api = require('./api.js');

var Api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var tasks = void 0;
var taskTpl = void 0;

getTemplate().then(function (data) {
  //get hbs template
  taskTpl = data;
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
    return okMsg;
  }
};

exports.Api = Api;
exports.fetchTask = fetchTask;