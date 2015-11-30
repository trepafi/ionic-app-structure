'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  gulp.task('watch', function () {

    gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);

    gulp.watch([
      options.styles + '/**/*.styl'
    ], function(event) {
      console.log('LR event', event);
      if(isOnlyChange(event)) {
        gulp.start('styles');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch(options.scripts + '/**/*.js', function(event) {
      console.log('LR event', event);
      if(isOnlyChange(event)) {
        gulp.start('scripts');
      } else {
        gulp.start('inject');
      }
    });

    gulp.watch(options.scripts + '/**/*.jade', function(event) {
      console.log('LR event', event);
      gulp.start('inject');
    });

    gulp.watch(options.src + '/**/*.html', function(event) {
      console.log('LR event', event);
      browserSync.reload(event.path);
    });
  });
};
