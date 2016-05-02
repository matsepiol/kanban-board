import * as Api from './api.js';
let tasks;
let taskTpl;

getTemplate().then(function(data) { //get hbs template
  taskTpl = Handlebars.compile(data);
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
    let taskType = document.getElementsByClassName(task.type)[0];
    //let taskHtml = taskTpl(task);
    //console.log(taskHtml);
    return okMsg;
  }
};

function addTask(options) {
  let promise = new Promise(function(resolve, reject) {
    Api.addTask(options, (task) => {
      toggleDialog();
      return "Task succesfully added."
    });
  });
};

window.toggleDialog = () => {
 let dialog = document.getElementsByClassName('add-task-dialog')[0];

 if (dialog.classList.contains('hidden')) {
    dialog.classList.remove('hidden');
 }
 else {
    dialog.classList.add('hidden');
    let inputs = document.getElementsByClassName('properties')[0].getElementsByTagName('input');

    for (let i = 0 ; i < inputs.length ; i++) {
      inputs[i].value = "";
    }
  }
};

window.getNewTaskOptions = () => {
  let taskName = document.getElementsByClassName('name-input')[0].getElementsByTagName('input')[0].value,
      taskAuthor = document.getElementsByClassName('author-input')[0].getElementsByTagName('input')[0].value,
      taskDesc = document.getElementsByClassName('description-input')[0].getElementsByTagName('input')[0].value,
      taskType;

  let typeCheckbox = document.getElementsByClassName('task-type-form')[0].getElementsByTagName('input');
  for (let i = 0 ; i < typeCheckbox.length ; i++) {
    if (typeCheckbox[i].checked) {
      taskType = typeCheckbox[i].value;
    }
  }

  let taskObject = {
    name: taskName,
    author: taskAuthor,
    type: taskType,
    description: taskDesc
  };

  addTask(taskObject);

};

export {Api, fetchTask, addTask};