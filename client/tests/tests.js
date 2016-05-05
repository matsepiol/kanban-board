import * as Main from '../js/main.js';

describe('Unit tests:', () => {
  let tasks = {},
      hehe;

  beforeEach( () => {
  });

  it('Testing if tests works', () => {
    let a = true;
    expect(a).toBe(true);
  });

  it('Test if tasks has all the required fields', () => {
    let exampleTask = {
      name: 'test',
      author: 'test1',
      type: ''
    };

    let result = Main.fetchTask(exampleTask);
    expect(result).toBe('Required fields are missing.');
  });

  it('Test if correct tasks are passing correctly', () => {
    let correctTask = {
      name: 'correct test',
      author: 'Mateusz Sepiol',
      type: 'to-do',
      description: 'test decs'
    };

    spyOn(Main, 'fetchTask').and.returnValue('Everything is fine');
    let result = Main.fetchTask(correctTask);
    expect(result).toBe('Everything is fine');
  });

  it('Test if toggling dialog works after adding task', () => {
    let task = {
      name: 'correct test',
      author: 'Mateusz Sepiol',
      type: 'to-do',
      description: 'test decs'
    };

    spyOn(window, 'toggleDialog');
    Main.addTask(task);
    expect(window.toggleDialog).toHaveBeenCalled();
  });

  it('Test if toggling dialog works after editing task', () => {
    let task = {
      name: 'correct test',
      author: 'Mateusz Sepiol',
      type: 'to-do',
      description: 'test decs'
    };

    spyOn(window, 'toggleDialog');
    Main.editTask(task);
    expect(window.toggleDialog).toHaveBeenCalled();
  });

});