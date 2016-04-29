import * as Api from './api.js';
let tasks;
let taskTpl;


getTemplate().then(function(data) { //get hbs template
  taskTpl = data;
  getTasks().then(function(tasks) { //get tasks from API
    for (let i = 0 ; i < tasks.length ; i++) {
      fetchTask(tasks[i]);
    }
  });
})
  
function getTasks() {
  let promise = new Promise(function(resolve, reject) {
    Api.getTasks( (tasks) => {
      resolve(JSON.parse(tasks));
    });
  });
  return promise;
};

function getTemplate() {
  let promise = new Promise(function(resolve, reject) {
    let http = new XMLHttpRequest();

    http.open("GET", '../handlebars/taskTpl.hbs', true);
    http.send(null);

    http.onreadystatechange = (e) => {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText);
      }
    };

    http.onerror = (e) => {
      reject(e);
    };
  });

  return promise;
};

function fetchTask(task) {
  let errMsg = 'Required fields are missing.',
      okMsg = 'Everything went fine!';

  if (!task.name || !task.author || !task.type) {
    return errMsg;
  }
  else {
    return okMsg;
  }
};

export {Api, fetchTask};