import * as Main from '../js/main.js';

describe('Unit tests:', () => {
  let tasks = {};
  let hehe;

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

    let result = Main.fetchTask(correctTask);
    expect(result).toBe('Everything went fine!');
  });

  it('Test if adding tasks works fine', () => {
    let task = {
      name: 'correct test',
      author: 'Mateusz Sepiol',
      type: 'to-do',
      description: 'test decs'
    };

    let result = Main.addTask(task);
    expect(result).toBe('Task succesfully added.');

  });

});