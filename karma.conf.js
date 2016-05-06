'use strict';
module.exports = function(config) {

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'client/build/main.js', included: false },
      { pattern: 'client/build/tests.js', included: true}
    ],
/*    preprocessors: {
      'client/tests/tests.js': ['browserify']
    },*/
/*    browserify: {
      debug: true,
      transform: [
        ["babelify", { "presets": ["es2015"] }]]
    },*/
    reporters: ['progress'],
    browsers: ['Firefox'],
    colors: true,
    autoWatch: true,
    singleRun: false
  });
};
