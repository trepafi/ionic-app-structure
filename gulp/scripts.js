'use strict';

var gulp = require('gulp');
var path = require('path');
var stylish = require('jshint-stylish');
var streamqueue = require('streamqueue');
var browserSync = require('browser-sync');

module.exports = function(options, $) {
  gulp.task('jsHint', function(done) {
    return gulp
      .src([
        options.src + '/**/*.js'
      ])
      .pipe($.jshint())
      .pipe($.jshint.reporter(stylish))

      .on('error', options.errorHandler);
      done();
  });

  gulp.task('scripts', ['markup'], function() {
    var dest = path.join(options.targetDir, '');
    var minifyConfig = {
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeComments: true
    };

    var templateStream = gulp
      .src(options.tmp + '/templates/**/*.html')   // Using tmp folde to store generated html files
      .pipe($.angularTemplatecache('templates.js', {
        root: 'templates',
        module: options.appName,
        htmlmin: options.build && minifyConfig
      }));

    var scriptStream = gulp
      .src([
        options.src + '/**/*.js',
        '!' + options.src + '/**/*.spec.js'
      ])
      .pipe($.if(!options.build, $.changed(dest)));

    return streamqueue({ objectMode: true }, scriptStream, templateStream)
      .pipe($.ngAnnotate())
      .pipe($.if(options.args.stripDebug, $.stripDebug()))
      .pipe($.if(options.build, $.concat('app.js')))
      .pipe($.if(options.build, $.uglify()))
      .pipe($.if(options.build && !options.args.emulate, $.rev()))
      .pipe(gulp.dest(dest))
      .on('error', options.errorHandler);
  });
};
