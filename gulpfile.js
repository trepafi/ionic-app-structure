'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

var args = require('yargs')
  .alias('e', 'env')
  .default('env', 'dev')
  .argv;

var options = {
  appName: 'lubertapp',

  src: 'app',
  assets: 'app/assets',
  dist: 'www',
  tmp: '.tmp',

  scripts: 'app/scripts',
  styles: 'app/styles',
  images: 'app/images',
  fonts: 'app/fonts',

  args: args,
  release: args.env === 'prd',
  targetDir: args.env === 'prd' ? 'www' : '.tmp',

  bower_components: 'bower_components',

  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },

  wiredep: {
    directory: 'bower_components',
    exclude: [/jquery/],
    onPathInjected: function(fileObject) {
      // console.log(':: FILE', fileObject);
      var ff = fileObject.path.indexOf('fieldmargin-frontend');
      // console.log(ff !== -1);
    }
  }
};

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

$.sequence = require('run-sequence');

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options, $);
});

gulp.task('default', ['clean'], function () {

});
