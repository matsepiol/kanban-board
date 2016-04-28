'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var baseDomain = 'http://localhost:3000/';

function getTasks(callback) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (http.readyState === 4 && http.status === 200) {
      callback(http.responseText);
    }
  };
  http.open("GET", baseDomain + 'api/tasks', true);
  http.send(null);
};

exports.getTasks = getTasks;