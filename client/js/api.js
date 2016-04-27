'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTasks = getTasks;
var baseDomain = 'http://localhost:3000/';

function getTasks() {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (http.readyState === 4 && http.status === 200) {
      return http.responseText;
    }
  };
  http.open("GET", baseDomain + 'api/tasks', true);
  http.send(null);
};