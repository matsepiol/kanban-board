var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var Server = require('karma').Server;
var nodemon = require('gulp-nodemon');
var builder = require('systemjs-builder');
var runSequence = require('run-sequence');

var autoprefixerOptions = {
  browsers: ['> 1%' ]
};

var builderConfig = {
  src: 'client/js/*.js',
  systemBuild: 'client/build',
  bundleName: 'main',
  babel: {modules: 'system'},   // use SystemJS as module builder in 6to5
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

gulp.task('bundle', () => {
  builder.buildSFX(builderConfig.bundleName, builderConfig.bundleBuild, options).then(function() {
    console.log('Build complete');
  })
  .catch(function(err) {
    console.log('Build error');
    console.log(err);
  });
});

gulp.task('run', (callback) => {
  runSequence('build', ['bundle'], 'sass', 'start', 'test', callback);
});

gulp.task('start', function() {
  nodemon({
      script: 'index.js',
      watch: ['index.js', 'client/js/*.js', 'client/scss/style.scss'],
      ext: 'js'
  }).on('restart', () => {
    gulp.run(['build', 'sass']);
  gulp.src('index.js')
  });
});

gulp.task('sass', () => {
  return gulp.src('client/scss/style.scss')
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('client/'));
});

gulp.task('test', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('watch', function() {
  gulp.watch(builderConfig.src, ['build']);
  gulp.watch('client/scss/*.scss'), ['sass'];
});
