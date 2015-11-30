'use strict';
var gulp = require('gulp');
var path = require('path');
var streamqueue = require('streamqueue');

module.exports = function(options, $) {
  gulp.task('images', function() {
    var imagesStream = gulp.src([
        options.images + '/**/*.*'
      ])
      .pipe(gulp.dest(path.join(options.targetDir, 'images')))
      .on('error', options.errorHandler);

    return streamqueue({ objectMode: true }, imagesStream);
  });
};
