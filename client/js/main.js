'use strict';

import App from './app';

let taskTpl;

function getTemplate() {
  let promise = new Promise( (resolve, reject) => {
    let http = new XMLHttpRequest();

    http.open('GET', '../handlebars/taskTpl.hbs', true);
    http.send(null);

    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText);
      }
    };

    http.onerror = e => {
      reject(e);
    };
  });

  return promise;
}

//get task template - if done run application
getTemplate().then( data => {
  window.taskTpl = Handlebars.compile(data);

  let app = new App();
  
  window.toggleDialog = app.toggleDialog;
  window.getNewTaskOptions = app.getNewTaskOptions;
  window.handleDragEvents = app.handleDragEvents;
});