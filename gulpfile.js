var gulp = require('gulp'),
  sass = require('gulp-sass'),
  inject = require('gulp-inject'),
  uglify = require('gulp-uglify'),
  gconcat = require('gulp-concat'),
  grename = require('gulp-rename'),
  gsourcemaps = require('gulp-sourcemaps'),
  gstripdebug = require('gulp-strip-debug'),
  gcssmin = require('gulp-cssmin'),
  gangulartemplates = require('gulp-angular-templates')
  gconnect = require('gulp-connect');

var paths = {
  base: './',
  index: './index.html',
  app: './app',
  build: './app/build',
  html: {
    src: ['./index.html', './app/components/*.html'],
    templates: 'app.templates.js'
  },
  scripts: {
    src: ['./app/app*.js', './app/components/**/*.js'],
    min: 'app.min.js'
  },
  styles: {
    src: ['./app/components/**/*.scss'],
    min: 'app.min.css'
  }
};

gulp.task('build', ['scripts-build', 'styles-build', 'strip-debug', 'inject']);

gulp.task('html-build', function() {
  gulp.src('./app/components/**/*.html')
    .pipe(gangulartemplates({
      basePath: 'app/components/',
      module: 'mp'
    }))
    .pipe(gconcat(paths.html.templates))
    .pipe(gulp.dest(paths.app));
});

gulp.task('inject', function() {
  var target = gulp.src(paths.index),
    sources = gulp.src([
      paths.build + '/' + paths.scripts.min,
      paths.build + '/' + paths.styles.min
    ], {
      read: false
    });
  return target.pipe(inject(sources))
    .pipe(gulp.dest(paths.base));
});

gulp.task('scripts-build', function() {
  return gulp.src(paths.scripts.src)
    .pipe(gconcat(paths.scripts.min))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task('scripts-sourcemaps', function() {
  return gulp.src(paths.scripts.min)
    .pipe(gsourcemaps.init())
    .pipe(gsourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

gulp.task('strip-debug', function() {
  return gulp.src([paths.scripts.min, paths.styles.min])
    .pipe(gstripdebug())
    .pipe(gulp.dest(paths.build));
});

gulp.task('styles-build', function() {
  gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gcssmin())
    .pipe(grename(paths.styles.min))
    .pipe(gulp.dest(paths.build));
});

gulp.task('styles-sourcemaps', function() {
  gulp.src(paths.styles.min)
    .pipe(gsourcemaps.init())
    .pipe(gsourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

/**
 * Watches and reloads html, css, js files when any changes are made
 */
gulp.task('watch', function() {
  gulp.watch(paths.scripts.src, ['scripts-build', 'scripts-sourcemaps', 'inject']);
  gulp.watch(paths.styles.src, ['styles-build', 'styles-sourcemaps', 'inject']);
  gulp.watch(paths.html.src, ['html-build', 'scripts-build', 'scripts-sourcemaps', 'inject']);
  gulp.watch(paths.index, function() {

    gulp.src(paths.index)
      .pipe(gconnect.reload());
  });
});

gulp.task('connect', function() {
  gconnect.server({
    livereload: true
  });
});

gulp.task('default', ['connect', 'watch', 'html-build', 'scripts-build', 'scripts-sourcemaps', 'styles-build', 'inject']);
