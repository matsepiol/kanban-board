'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTasks = getTasks;
exports.getTaskById = getTaskById;
exports.addTask = addTask;
exports.editTask = editTask;
exports.deleteTask = deleteTask;
var baseDomain = 'http://localhost:3000/',
    http = new XMLHttpRequest();

var sendRequest = function sendRequest(req, url, params) {
  var promise = new Promise(function (resolve, reject) {

    if (params) {
      params = JSON.stringify(params);
    }

    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText);
      }
    };

    http.open(req, url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(params);
  });

  return promise;
};

function getTasks(callback) {
  var url = baseDomain + 'api/tasks';
  sendRequest('GET', url).then(function (data) {
    callback(data);
  });
};

function getTaskById(taskId, callback) {
  var url = baseDomain + 'api/tasks/' + taskId;
  sendRequest('GET', url).then(function (data) {
    callback(data);
  });
};

function addTask(task, callback) {
  var url = baseDomain + 'api/tasks';
  sendRequest('POST', url, task).then(function (data) {
    callback(data);
  });
};

function editTask(taskId, task, options, callback) {
  var url = baseDomain + 'api/tasks/' + taskId;
  sendRequest('PUT', url, task).then(function (data) {
    callback(data);
  });
};

function deleteTask(taskId, callback) {
  var url = baseDomain + 'api/tasks/' + taskId;
  sendRequest('DELETE', url).then(function (data) {
    callback(data);
  });
};