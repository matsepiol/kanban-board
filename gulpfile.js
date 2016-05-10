var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var Server = require('karma').Server;
var nodemon = require('gulp-nodemon');
var exec = require('gulp-exec');
var builder = require('systemjs-builder');
var runSequence = require('run-sequence');

var autoprefixerOptions = {
  browsers: ['> 1%' ]
};

var builderConfig = {
  src: 'client/js/*.js',
  systemBuild: 'client/build',
  bundleName: 'main',
  bundleBuild: 'client/dist/app.js'
};

var options = {
  config: {
    baseURL: 'file:' + path.resolve(builderConfig.systemBuild)
  }
};

gulp.task('build', () => {
  return gulp.src(builderConfig.src)
    .pipe(babel(builderConfig.babel))
    .pipe(gulp.dest(builderConfig.systemBuild));
});

gulp.task('bundle', ['build'], () => {
  builder.buildSFX(builderConfig.bundleName, builderConfig.bundleBuild, options).then( () => {
    console.log('Build complete');
  })
  .catch( (err) => {
    console.log('Build error');
    console.log(err);
  });
});

gulp.task('start', () => {
  nodemon({
      script: 'index.js',
      env: {
        'NODE_ENV': 'development'
      },
      ext: 'js'
  });
});

gulp.task('compile', (done) => {
  runSequence('build', 'bundle');
  done();
});

gulp.task('sass', () => {
  return gulp.src('client/scss/style.scss')
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('client/'));
});

gulp.task('test', (done) => {
  new Server({
    configFile: __dirname + '/client/karma.conf.js'
  }, done).start();
});

gulp.task('watch', () => {
  gulp.watch(builderConfig.src, ['compile']);
  gulp.watch('client/scss/*.scss'), ['sass'];
});

gulp.task('run', (callback) => {
  runSequence('build', 'bundle', 'sass', 'watch', 'start', 'test', callback);
});

