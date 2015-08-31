var gulp = require('gulp'),
  sass = require('gulp-sass'),
  inject = require('gulp-inject'),
  uglify = require('gulp-uglify'),
  concatFiles = require('gulp-concat'),
  rename = require('gulp-rename'),
  sourceMaps = require('gulp-sourcemaps'),
  gstripdebug = require('gulp-strip-debug'),
  cssMin = require('gulp-cssmin'),
  angularTemplates = require('gulp-angular-templates')
connectServer = require('gulp-connect'),
  runSequence = require('run-sequence');

var paths = {
  base: './',
  index: './index.html',
  app: './app',
  build: './app/build',
  html: {
    src: ['./index.html', './app/components/**/*.html'],
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

gulp.task('build', function() {
  runSequence('html-build', ['scripts-build', 'styles-build'],
    'strip-debug',
    'inject');
});

gulp.task('html-build', function() {
  gulp.src('./app/components/**/*.html')
    .pipe(angularTemplates({
      basePath: 'app/components/',
      module: 'mp'
    }))
    .pipe(concatFiles(paths.html.templates))
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
    .pipe(concatFiles(paths.scripts.min))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task('scripts-sourcemaps', function() {
  return gulp.src(paths.scripts.min)
    .pipe(sourceMaps.init())
    .pipe(sourceMaps.write())
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
    .pipe(cssMin())
    .pipe(rename(paths.styles.min))
    .pipe(gulp.dest(paths.build));
});

gulp.task('styles-sourcemaps', function() {
  gulp.src(paths.styles.min)
    .pipe(sourceMaps.init())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(paths.build));
});

/**
 * Watches and reloads html, css, js files when any changes are made
 */
gulp.task('watch', function() {
  gulp.watch(paths.scripts.src, function() {
    runSequence('scripts-build', 'scripts-sourcemaps', 'inject', 'connect-reload');
  });
  gulp.watch(paths.styles.src, function() {
    runSequence('styles-build', 'styles-sourcemaps', 'inject', 'connect-reload');
  });
  gulp.watch(paths.html.src, function() {
    runSequence('html-build', 'scripts-build', 'scripts-sourcemaps', 'inject');
  });
});

gulp.task('connect', function() {
  connectServer.server({
    livereload: true
  });
});

gulp.task('connect-reload', function() {
  gulp.src(paths.base)
    .pipe(connectServer.reload());
});

gulp.task('default', function() {
  runSequence('connect', 'watch', 'html-build', 'scripts-build', 'scripts-sourcemaps', 'styles-build', 'styles-sourcemaps', 'inject');
});
