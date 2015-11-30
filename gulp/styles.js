'use strict';

var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;

module.exports = function(options, $) {
  gulp.task('styles', function () {
    var dest = path.join(options.targetDir, 'styles');
    var injectFiles = gulp.src([
      options.styles + '/**/*.styl',
      '!' + options.styles + '/index.styl'
    ], { read: false })
    .pipe($.debug({title: 'Styles FILES'}));

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/styles', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var indexFilter = $.filter('index.styl');

    return gulp.src([
      options.styles + '/index.styl',
    ])
      .pipe(indexFilter)
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(indexFilter.restore())
      .pipe($.sourcemaps.init())
      .pipe($.stylus()).on('error', options.errorHandler('Stylus'))
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(dest))
      .pipe(browserSync.reload({ stream: true }));
  });
};
