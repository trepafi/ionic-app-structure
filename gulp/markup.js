'use strict';
var gulp = require('gulp');
var path = require('path');

module.exports = function(options, $) {
  gulp.task('markup', function() {
    return gulp.src(options.scripts + '/**/*.jade')
      .pipe($.jade({
        pretty: true
      }))
      .pipe( gulp.dest(path.join(options.tmp, 'templates')) )
      .on('error', options.errorHandler);
  });
};
