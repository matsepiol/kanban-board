'use strict';
import * as Api from './api';

let tasks, taskTpl,
    isEditing = false,
    taskId;

getTemplate().then( (data) => { //get hbs template
  taskTpl = Handlebars.compile(data);
  getTasks().then( (tasks) => { //get tasks from API
    for (let i = 0 ; i < tasks.length ; i++) {
      fetchTask(tasks[i]);
    }
  });
});
  
function getTasks() {
  let promise = new Promise( (resolve, reject) => {
    Api.getTasks( (tasks) => {
      resolve(JSON.parse(tasks));
    });
  });
  return promise;
}

function getTemplate() {
  let promise = new Promise( (resolve, reject) => {
    let http = new XMLHttpRequest();

    http.open('GET', '../handlebars/taskTpl.hbs', true);
    http.send(null);

    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText);
      }
    };

    http.onerror = (e) => {
      reject(e);
    };
  });

  return promise;
}

function fetchTask(task) {
  let typeSection = document.getElementsByClassName(task.type)[0],
      errMsg = 'Required fields are missing.',
      okMsg = 'Everything went fine!';

  if (!task.name || !task.author || !task.type) {
    return errMsg;
  }
  else {
    if (!typeSection) return;

    let taskHtml = taskTpl(task),
        currentTask = document.createElement('div');
    
    currentTask.setAttribute('data-taskid', task._id);
    currentTask.classList.add('task');
    currentTask.innerHTML = taskHtml;

    typeSection.appendChild(currentTask);
    return okMsg;
  }
}

function addTask(options) {
  let promise = new Promise( (resolve, reject) => {
    Api.addTask(options, (task) => {
      fetchTask(JSON.parse(task));
      return 'Task succesfully added.';
    });
  });
  toggleDialog();
}

function editTask(taskId, taskObj) {
  let promise = new Promise( (resolve, reject) => {
    Api.editTask(taskId, taskObj, {}, (task) => {
      updateTask(JSON.parse(task));

      //end of editing 
      isEditing = false;
    });
  });
  toggleDialog();
}

function updateTask(task) {
  let taskEl = document.querySelectorAll('[data-taskid="' + task._id + '"]')[0],
      formerType = taskEl.closest('.board').classList[1];

  // if changed task type - move task to different board
  if (formerType !== task.type) {
    taskEl.parentElement.removeChild(taskEl);  
    fetchTask(task); 
  }
  else {
    taskEl.getElementsByClassName('task-name')[0].textContent = task.name;
    taskEl.getElementsByClassName('task-author')[0].textContent = task.author;
    taskEl.getElementsByClassName('task-desc')[0].textContent = task.description;
  }
}

window.toggleDialog = (taskObj) => {
 let dialog = document.getElementsByClassName('add-task-dialog')[0],
     inputs = document.getElementsByClassName('properties')[0].getElementsByTagName('input'),
     editTitle = 'Edit Task',
     addTaskTitle = 'Add New Task';

 if (dialog.classList.contains('hidden')) {
    dialog.classList.remove('hidden');
 }
 else {
    dialog.classList.add('hidden');

    for (let i = 0 ; i < inputs.length ; i++) {
      inputs[i].value = '';
    }
  }

  let titleEl = document.getElementsByClassName('add-task-dialog')[0].getElementsByTagName('h2')[0];
  //while editing
  if (taskObj) {
    let {taskName, taskAuthor, taskDesc, taskType} = taskObj;
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

window.getNewTaskOptions = () => {
  let taskName = document.getElementsByClassName('name-input')[0].getElementsByTagName('input')[0].value,
      taskAuthor = document.getElementsByClassName('author-input')[0].getElementsByTagName('input')[0].value,
      taskDesc = document.getElementsByClassName('description-input')[0].getElementsByTagName('input')[0].value,
      typeCheckbox = document.getElementsByClassName('task-type-form')[0].getElementsByTagName('input'),
      taskType;

  for (let i = 0 ; i < typeCheckbox.length ; i++) {
    if (typeCheckbox[i].checked) {
      taskType = typeCheckbox[i].value;
    }
  }

  //all fields must be filled
  // TODO - visible alert that you haven't filled all inputs
  if (!taskName || !taskAuthor || !taskDesc) return;

  let taskObject = {
    name: taskName,
    author: taskAuthor,
    type: taskType,
    description: taskDesc
  };

  if (isEditing) {
    editTask(taskId, taskObject);
  }
  else {
    addTask(taskObject);
  }
};

window.deleteTask = (obj) => {
  let taskEl = obj.parentElement,
      taskId = taskEl.getAttribute('data-taskid');

  let promise = new Promise( (resolve, reject) => {
    Api.deleteTask(taskId, (task) => {
      taskEl.parentElement.removeChild(taskEl);  
      return 'Task succesfully deleted.';
    });
  });
};

window.showEditDialog = (obj) => {
  let taskEl = obj.parentElement,
      taskObj = {
        taskName: taskEl.getElementsByClassName('task-name')[0].textContent,
        taskAuthor: taskEl.getElementsByClassName('task-author')[0].textContent,
        taskDesc: taskEl.getElementsByClassName('task-desc')[0].textContent,
        taskType: taskEl.closest('.board').classList[1]
      }
  
  taskId = taskEl.getAttribute('data-taskid');
  isEditing = true;
  toggleDialog(taskObj);
};

export {fetchTask, addTask, toggleDialog, editTask};