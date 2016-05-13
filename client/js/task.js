import Api from './api';

export default class Task {

  constructor(task, taskTpl) {
    this.api = Api;
    this.name = task.name;
    this.author = task.author;
    this.description = task.description;
    this.type = task.type;
    this.id = task._id;
    this.taskTpl = taskTpl;
  }

  addTask(options) {
    let promise = new Promise( (resolve, reject) => {
      let api = new Api();
      api.addTask(options, (task) => {
        //this.fetchTask(JSON.parse(task));
        return 'Task succesfully added.';
      });
    });
    toggleDialog();
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

      let taskHtml = task.taskTpl(task),
          currentTaskEl = document.createElement('div');
      
      currentTaskEl.setAttribute('data-taskid', task.id);
      currentTaskEl.classList.add('task');
      currentTaskEl.innerHTML = taskHtml;

      typeSection.appendChild(currentTaskEl);
      this.appendEventsToTask(currentTaskEl);
      return okMsg;
    }
  }

  appendEventsToTask(currentTaskEl) {
    let self = this,
        closeButton = currentTaskEl.getElementsByClassName('icon-cancel')[0],
        editButton = currentTaskEl.getElementsByClassName('edit-task')[0];

    closeButton.addEventListener('click', () => { self.deleteTask(self); });
    editButton.addEventListener('click', () => { toggleDialog(self); });
  }

  editTask(taskId, taskObj) {
    let promise = new Promise( (resolve, reject) => {
      let api = new Api();
      api.editTask(taskId, taskObj, {}, (task) => {
        //this.updateTask(JSON.parse(task));
      });
    });
    toggleDialog();
  }

  deleteTask(task) {
    let taskEl = document.querySelectorAll('[data-taskid="' + task.id + '"]')[0];

    let promise = new Promise( (resolve, reject) => {
      let api = new task.api();
      api.deleteTask(task.id, (task) => {
        taskEl.parentElement.removeChild(taskEl);  
        console.log('Task succesfully deleted.');
      });
    });
  }


}