'use strict';

var _api = require('js/api.js');

var tasks = void 0;

(0, _api.getTasks)(function (tasks) {
  tasks = JSON.parse(tasks);
  console.log(tasks);
});