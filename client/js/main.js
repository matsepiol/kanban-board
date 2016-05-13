'use strict';

import App from './app';

// experiment - to be addressed 

/*Handlebars.registerHelper('func', function(fn, context) {
  let contextStr = JSON.stringify(context).replace(/"/g, "'");
     return new Handlebars.SafeString("(" + 
                fn.toString().replace(/\"/g,"'") + ")(" + contextStr + ")");
});*/

let app = new App();

window.toggleDialog = app.toggleDialog;
window.getNewTaskOptions = app.getNewTaskOptions;