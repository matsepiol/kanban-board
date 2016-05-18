'use strict';
module.exports = function(config) {

  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
      { pattern: 'tests/tests.js', included: true}
    ],
    preprocessors: {
      'tests/tests.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: ['babelify']
    },
    reporters: ['progress'],
    browsers: ['Firefox'],
    colors: true,
    autoWatch: true,
    singleRun: false
  });
};
