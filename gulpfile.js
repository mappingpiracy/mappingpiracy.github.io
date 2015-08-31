var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  sass = require('gulp-sass'),
  inject = require('gulp-inject'),
  uglify = require('gulp-uglify'),
  gconcat = require('gulp-concat'),
  grename = require('gulp-rename'),
  gsourcemaps = require('gulp-sourcemaps'),
  gstripdebug = require('gulp-strip-debug'),
  gcssmin = require('gulp-cssmin');

// var config = {
//   paths: {
//     base: './',
//     html: ['index.html', './app/components/*.html'],
//     js: ['./app/app*.js', './app/components/**/*.js'],
//     css: ['./app/components/common/styles/css/*.css'],
//     scss: ['./app/components/common/styles/scss/*']
//   }
// };

var paths = {
  base: './',
  index: './index.html',
  build: './app/build',
  html: {
    src: ['./index.html', './app/components/*.html'],
  }
  js: {
    src: ['./app/app*.js', './app/components/**/*.js'],
    min: 'app.min.js'
  },
  sass: {
    src: ['./app/components/**/*.scss'],
    min: 'app.min.css'
  }
};

gulp.task('build', ['js-build', 'js-inject', 'sass-build']);

gulp.task('js-inject', function() {
  var target = gulp.src(paths.index),
    sources = gulp.src(paths.build + '/' + paths.js.min, {
      read: false
    });
  return target.pipe(inject(sources))
    .pipe(gulp.dest(paths.base));
});

gulp.task('js-build', function() {
  return gulp.src(paths.js.src)
    .pipe(gconcat(paths.js.min))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task('js-sourcemaps', function() {
  return gulp.src(paths.js.min)
    .pipe(gsourcemaps.init())
    .pipe(gsourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

gulp.task('strip-debug', function() {
  return gulp.src([paths.js.min, paths.sass.min])
    .pipe(gstripdebug())
    .pipe(gulp.dest(paths.build));
});

gulp.task('sass-build', function() {
  gulp.src(paths.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gcssmin())
    .pipe(grename(paths.sass.min))
    .pipe(gulp.dest(paths.build));
});

gulp.task('sass-sourcemaps', function() {
  gulp.src(paths.sass.min)
    .pipe(gsourcemaps.init())
    .pipe(gsourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

/**
 * Watches and reloads html, css, js files when any changes are made
 */
gulp.task('watch', function() {
  gulp.watch(paths.html.src, function() {
    gulp.src(paths.html.src);
  });
  gulp.watch(paths.js.src, ['js-build', 'js-sourcemaps', 'js-inject']);
  gulp.watch(paths.sass.src, ['sass-build', 'sass-sourcemaps']);
});

/**
 * Launches a local webserver to run the angular app
 */
gulp.task('webserver', function() {
  gulp.src(config.paths.base)
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 9898
    }));
});

gulp.task('default', ['webserver', 'watch']);
