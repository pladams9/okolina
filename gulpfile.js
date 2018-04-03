/*******************************************************************************
 * REQUIRES
 ******************************************************************************/

var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var inject = require('gulp-inject-string');

/*******************************************************************************
 * BUILD TASKS
 ******************************************************************************/

gulp.task('build:clean', function() {
  return del('./build/**');
});

gulp.task('build:static', function() {
  return gulp.src('./src/**/*.+(html|htm|jpg|png|svg)')
    .pipe(gulp.dest('./build/'));
});

gulp.task('build:php', function() {
  return gulp.src('./src/**/*.php')
    .pipe(gulp.dest('./build/'));
});

var js_files = [
  'src/js/drawing.js',
  'src/js/main.js'
];
gulp.task('build:js', function() {
  return gulp.src(js_files)
    .pipe(concat('js/okolina.js'))
    .pipe(inject.prepend(';(function() {\n\n'))
    .pipe(inject.append('\n\n}) ();'))
    .pipe(gulp.dest('./build/'));
});

/*******************************************************************************
 * DEFAULT TASK
 ******************************************************************************/

gulp.task('default',
  gulp.series('build:clean', gulp.parallel('build:static', 'build:php', 'build:js')),
  function() { console.log('working'); }
);
