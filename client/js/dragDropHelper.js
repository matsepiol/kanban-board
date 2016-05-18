import Task from './task';

export default class dragDropHelper {
  
  constructor() {
    let targetBoard, originalType;
  }

  handleDragStart(e) {
    this.style.opacity = 0.4;  
    originalType = this.parentElement.classList[1];

    //for firefox
    e.dataTransfer.setData('elementClass', this.className);
  }

  handleDragEnter(e) {
    this.classList.add('dragged');
  }

  handleDragOver(e) {

    if (e.preventDefault) {
      e.preventDefault();
    }

    targetBoard = this;

  }

  handleDragLeave(e) {
    this.classList.remove('dragged');
  }

  handleDragEnd(e) {
    let grabbedTask = e.originalTarget,
        targetType = targetBoard.classList[1]

    targetBoard.classList.remove('dragged');
    grabbedTask.style.opacity = 1;

    if (originalType !== targetType) {
      let taskId = grabbedTask.getAttribute('data-taskid'),
          taskObject = {
            name: grabbedTask.getElementsByClassName('task-name')[0].textContent,
            author: grabbedTask.getElementsByClassName('task-author')[0].textContent,
            description: grabbedTask.getElementsByClassName('task-desc')[0].textContent,
            type: targetType,
          };
        
      let task = new Task(taskObject);
      
      task.editTask(taskId, taskObject);
      grabbedTask.parentElement.removeChild(grabbedTask);
      task.fetchTask(task); 
    }

  }

}