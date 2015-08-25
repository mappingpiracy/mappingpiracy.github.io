var gulp = require('gulp'),
  webserver = require('gulp-webserver');

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 9999
    }));
});

gulp.task('watch', function() {
  gulp.watch(['./**/*.html'], function() {
    gulp.src('./**/*.html');
  });
  gulp.watch(['./**/*.js'], function() {
    gulp.src('./**/*.js');
  });
  gulp.watch(['./**/*.css'], function() {
    gulp.src('./**/*.js');
  });
});

gulp.task('default', ['webserver', 'watch']);
