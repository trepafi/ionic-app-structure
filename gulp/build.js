'use strict';
var gulp = require('gulp');

module.exports = function(options, $) {
  gulp.task('join', function () {
    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(options.targetDir + '/*.html')                        // In every html on /www
        // .pipe($.debug())
        .pipe(assets = $.useref.assets())                               // Concats and minify group of files
        .pipe($.rev())                                                  // Adds a version to concatenated files
        .pipe(jsFilter)                                                 // Get JS files
        // .pipe($.uglify({preserveComments: $.uglifySaveLicense}))        // Uglify js
        .pipe(jsFilter.restore())
        .pipe(cssFilter)                                                // Get CSS files
        .pipe($.csso())                                                 // Optimize CSS files
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(htmlFilter.restore())
        .pipe($.debug({title: 'Build'}))
        .pipe(gulp.dest(options.targetDir))
        .pipe($.size({ title: options.targetDir + '/', showFiles: true }));
  });

  gulp.task('build', ['clean'], function () {
    return $.sequence(
      'inject',
      options.release ? 'join' : 'watch',
      ['images']
    );
  });
};
