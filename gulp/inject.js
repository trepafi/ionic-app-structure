'use strict';

var gulp = require('gulp');
var wiredep = require('wiredep').stream;

module.exports = function(options, $) {
  gulp.task('inject', ['scripts', 'styles'], function () {
    var injectStyles = gulp.src([
      options.targetDir + '/**/*.css',
      '!' + options.targetDir + '/vendor.css'
    ], { read: false });

    var injectScripts = gulp.src([
      options.targetDir + '/**/*.js',
      '!' + options.targetDir + '/**/*.spec.js',
      '!' + options.targetDir + '/**/*.mock.js'
    ])
    .pipe($.angularFilesort()).on('error', options.errorHandler('AngularFilesort'));

    var injectOptions = {
      ignorePath: [options.targetDir],
      addRootSlash: false
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectStyles, injectOptions))
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(options.wiredep))
      .pipe(gulp.dest(options.targetDir));
  });
};
