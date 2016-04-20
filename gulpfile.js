var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var System = require('systemjs');
var babel = require('gulp-babel');
var Server = require('karma').Server;

var autoprefixerOptions = {
  browsers: ['> 1%' ]
};

gulp.task('sass', function() {
  return gulp.src('scss/style.scss')
    .pipe(sass())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function() {
  return gulp.src('js/dev/main.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('./js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('watch', ['sass', 'js', 'test', 'browserSync'], function() {
  gulp.watch('scss/style.scss', ['sass']);
  gulp.watch('js/dev/*.js', ['js', 'test']);
  gulp.watch('tests/*.js', ['test']);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    browser: ['firefox']
  });
});

gulp.task('default', ['watch']);