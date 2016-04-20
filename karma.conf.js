'use strict';
module.exports = function(config) {

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'js/main.js', included: true },
      { pattern: 'tests/tests.js', included: true}
    ],
    reporters: ['progress'],
    browsers: ['Firefox'],
    colors: true,
    autoWatch: true,
    singleRun: false
  });
};
