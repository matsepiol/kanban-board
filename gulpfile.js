var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var Server = require('karma').Server;
var nodemon = require('gulp-nodemon');

var autoprefixerOptions = {
  browsers: ['> 1%' ]
};

gulp.task('start', function() {
  nodemon({
      script: 'index.js',
      watch: ['index.js', 'client/js/dev/*.js', 'client/scss/style.scss'],
      ext: 'js'
  }).on('restart', () => {
    gulp.run(['js', 'sass']);
  gulp.src('index.js')
  });
});

gulp.task('sass', () => {
  return gulp.src('client/scss/style.scss')
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('client/'));
});

gulp.task('js', () => {
  return gulp.src('client/js/dev/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('client/js/'));
});

gulp.task('test', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('watch', ['sass', 'js', 'test', 'start'], () => {
  gulp.watch('client/scss/style.scss', ['sass']);
  gulp.watch('client/js/dev/*.js', ['js']);
  gulp.watch('client/tests/*.js', ['test']);
});

gulp.task('default', ['watch']);