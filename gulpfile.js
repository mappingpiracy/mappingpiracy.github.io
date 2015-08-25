var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  sass = require('gulp-sass'),
  inject = require('gulp-inject');

var config = {
  paths: {
    base: './',
    html: ['index.html', './app/components/*.html'],
    js: ['./app/components/*.js'],
    css: ['./app/components/*.css']
  }
};

gulp.task('inject', function() {
  var target = gulp.src('./index.html'),
    sources = gulp.src(config.paths.js, {
      read: false
    });

  return target.pipe(inject(sources))
    .pipe(gulp.dest(config.paths.base));
});

/**
 * Launches a local webserver to run the angular app
 */
gulp.task('webserver', function() {
  gulp.src(config.paths.base)
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 9999
    }));
});

/**
 * Watches and reloads html, css, js files when any changes are made
 */
gulp.task('watch', function() {
  gulp.watch(config.paths.html, function() {
    gulp.src(config.paths.html);
  });
  gulp.watch(config.paths.js, function() {
    gulp.src(config.paths.js);
  });
  gulp.watch(config.paths.js, ['inject']);
  gulp.watch(config.paths.css, function() {
    gulp.src(config.paths.css);
  });
});

gulp.task('default', ['webserver', 'watch', 'inject']);
