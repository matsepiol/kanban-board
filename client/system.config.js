System.config({
  'baseURL': '',
  'transpiler': 'babel',
  'babelOptions': {
  },
  'paths': {
    'babel': 'node_modules/babel/index.js',
    'systemjs': 'node_modules/systemjs/dist/system.js',
    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js'
  },
  map: {
    babel: 'node_modules/babel-core/lib/api/browser.js'
  }
});

System.import('./js/main.js');