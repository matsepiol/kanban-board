import * as Api from './api';
import Task from './task';

export default class App {

  constructor() {
    let taskId;
    let isEditing = false;

    this.tasks = [];
    this.getTemplate().then( (data) => { //get hbs template
      this.taskTpl = Handlebars.compile(data);
      this.getTasks().then( (tasks) => { //get tasks from API
        for (let i = 0 ; i < tasks.length ; i++) {
          let task = new Task(tasks[i]);
          this.tasks.push(task);
          this.fetchTask(task);
        }
      });
    });
  }

  getTemplate() {
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

  getTasks() {
    let promise = new Promise( (resolve, reject) => {
      Api.getTasks( (tasks) => {
        resolve(JSON.parse(tasks));
      });
    });
    return promise;
  }

  fetchTask(task) {
    let typeSection = document.getElementsByClassName(task.type)[0],
        errMsg = 'Required fields are missing.',
        okMsg = 'Everything went fine!';

    if (!task.name || !task.author || !task.type) {
      return errMsg;
    }
    else {
      if (!typeSection) return;

      let taskHtml = this.taskTpl(task),
          currentTask = document.createElement('div');
      
      currentTask.setAttribute('data-taskid', task.id);
      currentTask.classList.add('task');
      currentTask.innerHTML = taskHtml;

      typeSection.appendChild(currentTask);
      return okMsg;
    }
  }

  toggleDialog(taskObj) {
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

    let titleEl = document.querySelector(".add-task-dialog h2");
    //while editing
    if (taskObj) {
      let {taskName, taskAuthor, taskDesc, taskType} = taskObj;
      document.querySelector(".name-input input").value = taskName;
      document.querySelector(".author-input input").value = taskAuthor;
      document.querySelector(".description-input input").value = taskDesc;
      document.getElementById(taskType).checked = true;
      titleEl.innerHTML = editTitle;
    }
    //while creating new task
    else {
      titleEl.innerHTML = addTaskTitle;
    }
  };

  showEditDialog(obj) {
    let taskEl = obj.parentElement,
        taskObj = {
          taskName: taskEl.getElementsByClassName('task-name')[0].textContent,
          taskAuthor: taskEl.getElementsByClassName('task-author')[0].textContent,
          taskDesc: taskEl.getElementsByClassName('task-desc')[0].textContent,
          taskType: taskEl.closest('.board').classList[1]
        }

    this.taskId = taskEl.getAttribute('data-taskid');
    this.isEditing = true;
    toggleDialog(taskObj);
  };

  deleteTask(obj) {
    let taskEl = obj.parentElement,
        taskId = taskEl.getAttribute('data-taskid');

    let promise = new Promise( (resolve, reject) => {
      Api.deleteTask(taskId, (task) => {
        taskEl.parentElement.removeChild(taskEl);  
        return 'Task succesfully deleted.';
      });
    });
  };

  getNewTaskOptions() {
    let taskName = document.querySelector('.name-input input').value,
        taskAuthor = document.querySelector('.author-input input').value,
        taskDesc = document.querySelector('.description-input input').value,
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

    let task = new Task(taskObject);

    if (isEditing) {
      let taskEl = document.querySelectorAll('[data-taskid="' + this.taskId + '"]')[0],
          formerType = taskEl.closest('.board').classList[1];

      task.editTask(this.taskId, taskObject); 

      if (formerType !== task.type) {
        taskEl.parentElement.removeChild(taskEl);  
        this.fetchTask(task); 
      }

      this.isEditing = false;
    }
    else {
      task.addTask(taskObject);
    }
  };

}
