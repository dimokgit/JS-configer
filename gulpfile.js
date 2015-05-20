// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), clean = require('gulp-clean');
var dist = "./lib/";

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('js', function() {
  return gulp.src(['./src/app/configer.js', './src/app/app-config.js'])
        .pipe(gulp.dest(dist));
});

// Removes all files from ./dist/
gulp.task('clean', function() {
    return gulp.src(dist+'**/*', { read: false })
        .pipe(clean());
});

gulp.task('default', ['js'], function (callback) {
  callback();
  console.log('\nPlaced optimized files in ' + chalk.magenta(dist + '\n'));
});
