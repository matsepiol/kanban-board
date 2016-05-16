import Api from './api';
import Task from './task';

export default class App {

  constructor() {
    let taskId,
        isEditing = false;

    this.getTasks().then( tasks => { //get tasks from API
      for (let i = 0 ; i < tasks.length ; i++) {
        let task = new Task(tasks[i]);
        task.fetchTask(task);
      }
    });
  }

  getTasks() {
    let promise = new Promise( (resolve, reject) => {
      let api = new Api();
      api.getTasks( tasks => {
        resolve(JSON.parse(tasks));
      });
    });

    return promise;
  }

  toggleDialog(taskObj) {
    let dialog = document.getElementsByClassName('add-task-dialog')[0],
        inputs = document.getElementsByClassName('properties')[0].getElementsByTagName('input'),
        editTitle = 'Edit Task',
        addTaskTitle = 'Add New Task';

   if (dialog.classList.contains('hidden')) {
      dialog.classList.remove('hidden');
      if (taskObj) taskId = taskObj._id;
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
      let {name, author, description, type} = taskObj;
      document.querySelector(".name-input input").value = name;
      document.querySelector(".author-input input").value = author;
      document.querySelector(".description-input input").value = description;
      document.getElementById(type).checked = true;
      titleEl.innerHTML = editTitle;
      isEditing = true;
    }
    //while creating new task
    else {
      titleEl.innerHTML = addTaskTitle;
      isEditing = false;
    }
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

      if (formerType !== taskObject.type) {
        taskEl.parentElement.removeChild(taskEl);
        task.fetchTask(task); 
      }
      else {
        taskEl.getElementsByClassName('task-name')[0].textContent = taskObject.name;
        taskEl.getElementsByClassName('task-author')[0].textContent = taskObject.author;
        taskEl.getElementsByClassName('task-desc')[0].textContent = taskObject.description;
      }

      this.isEditing = false;
    }
    else {
      task.addTask(taskObject);
    }
  };

}
