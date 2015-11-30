'use strict';
var gulp = require('gulp');

module.exports = function(options, $) {
  // clean target dir
  gulp.task('clean', function(done) {
    $.del([ options.tmp, options.dist ], done);
  });

  // no-op = empty function
  gulp.task('noop', function() {});
};
