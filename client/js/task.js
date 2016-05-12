import * as Api from './api';

export default class Task {
  
  constructor(task) {
    this.name = task.name;
    this.author = task.author;
    this.description = task.description;
    this.type = task.type;
    this.id = task._id;
  }

  addTask(options) {
    let promise = new Promise( (resolve, reject) => {
      Api.addTask(options, (task) => {
        this.fetchTask(JSON.parse(task));
        return 'Task succesfully added.';
      });
    });
    toggleDialog();
  };

  editTask (taskId, taskObj) {
    let promise = new Promise( (resolve, reject) => {
      Api.editTask(taskId, taskObj, {}, (task) => {
        this.updateTask(JSON.parse(task));
      });
    });
    toggleDialog();
  };

  updateTask (task) {
    let taskEl = document.querySelectorAll('[data-taskid="' + task._id + '"]')[0];

    taskEl.getElementsByClassName('task-name')[0].textContent = task.name;
    taskEl.getElementsByClassName('task-author')[0].textContent = task.author;
    taskEl.getElementsByClassName('task-desc')[0].textContent = task.description;
  }

}