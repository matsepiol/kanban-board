System.register([], function (_export) {
  var baseDomain, http, sendRequest;

  _export("getTasks", getTasks);

  _export("getTaskById", getTaskById);

  _export("addTask", addTask);

  _export("editTask", editTask);

  _export("deleteTask", deleteTask);

  function getTasks(callback) {
    var url = baseDomain + "api/tasks";
    sendRequest("GET", url).then(function (data) {
      callback(data);
    });
  }

  function getTaskById(taskId, callback) {
    var url = baseDomain + "api/tasks/" + taskId;
    sendRequest("GET", url).then(function (data) {
      callback(data);
    });
  }

  function addTask(task, callback) {
    var url = baseDomain + "api/tasks";
    sendRequest("POST", url, task).then(function (data) {
      callback(data);
    });
  }

  function editTask(taskId, task, options, callback) {
    var url = baseDomain + "api/tasks/" + taskId;
    sendRequest("PUT", url, task).then(function (data) {
      callback(data);
    });
  }

  function deleteTask(taskId, callback) {
    var url = baseDomain + "api/tasks/" + taskId;
    sendRequest("DELETE", url).then(function (data) {
      callback(data);
    });
  }

  return {
    setters: [],
    execute: function () {
      "use strict";

      baseDomain = "http://localhost:3000/";
      http = new XMLHttpRequest();

      sendRequest = function (req, url, params) {
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
          http.setRequestHeader("Content-type", "application/json");
          http.send(params);
        });

        return promise;
      };

      ;

      ;

      ;

      ;

      ;
    }
  };
});