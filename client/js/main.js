'use strict';
import App from './app';

let app = new App();

window.toggleDialog = app.toggleDialog;
window.getNewTaskOptions = app.getNewTaskOptions;
window.showEditDialog = app.showEditDialog;
window.deleteTask = app.deleteTask;
