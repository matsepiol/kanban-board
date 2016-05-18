import Api from './api';

export default class Task {

  constructor(task) {
    this.api = Api;
    this.name = task.name;
    this.author = task.author;
    this.description = task.description;
    this.type = task.type;
    this._id = task._id;
  }

  addTask(options) {
    let promise = new Promise( (resolve, reject) => {
      let api = new Api();
      api.addTask(options, task => {
        toggleDialog();
        this.fetchTask(JSON.parse(task));
        this._id = JSON.parse(task)._id;
        console.log('Task succesfully added');
      });
    });
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

      let taskHtml = taskTpl(task),
          tempEl = document.createElement('div'),
          currentTaskEl;
      
      tempEl.innerHTML = taskHtml;
      currentTaskEl = tempEl.firstChild;

      typeSection.appendChild(currentTaskEl);
      this.appendEventsToTask(currentTaskEl);
      window.handleDragEvents();

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
    this._id = taskId;
    let promise = new Promise( (resolve, reject) => {
      let api = new Api();
      api.editTask(taskId, taskObj, {}, task => {
        document.getElementsByClassName('add-task-dialog')[0].classList.add('hidden');
        console.log('Task succesfully edited');
      });
    });
  }

  deleteTask(task) {
    let taskEl = document.querySelectorAll('[data-taskid="' + task._id + '"]')[0];

    let promise = new Promise( (resolve, reject) => {
      let api = new task.api();
      api.deleteTask(task._id, task => {
        taskEl.parentElement.removeChild(taskEl);  
        console.log('Task succesfully deleted.');
      });
    });
  }


}