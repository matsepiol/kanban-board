import * as Main from '../js/main';
import Task from '../js/task';

describe('Unit tests:', () => {

  beforeEach( () => {
  });

  it('Testing if tests works', () => {
    let a = true;
    expect(a).toBe(true);
  });

  it('Test if tasks has all the required fields', () => {
    let taskObject = {
      name: 'test test',
      author: 'Mateusz Sepiol',
      type: '',
      description: 'test decs'
    };

    let task = new Task(taskObject);

    let result = task.fetchTask(task);
    expect(result).toBe('Required fields are missing.');
  });

  it('Test if correct tasks are passing correctly', () => {
    let correctTask = {
      name: 'correct test',
      author: 'Mateusz Sepiol',
      type: 'to-do',
      description: 'test decs'
    };

    let task = new Task(correctTask);

    spyOn(task, 'fetchTask').and.returnValue('Everything is fine');

    let result = task.fetchTask(correctTask);
    expect(result).toBe('Everything is fine');
  });

  it('Test if toggling dialog works after adding task', () => {
    let correctTask = {
      name: 'correct test',
      author: 'Mateusz Sepiol',
      type: 'to-do',
      description: 'test decs'
    };

    let task = new Task(correctTask);

    spyOn(task, 'fetchTask');
    task.addTask(task);
    expect(task.fetchTask).toHaveBeenCalled();
  });

  it('Test if toggling dialog works after editing task', () => {
    let task = {
      name: 'correct test',
      author: 'Mateusz Sepiol',
      type: 'to-do',
      description: 'test decs'
    };

    spyOn(window, 'handleDragEvents');
    task.editTask(task);
    expect(window.handleDragEvents).toHaveBeenCalled();
  });

});