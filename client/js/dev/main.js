import { getTasks } from 'js/api.js';
let tasks;

getTasks( (tasks) => {
  tasks = JSON.parse(tasks);
  console.log(tasks);
});
