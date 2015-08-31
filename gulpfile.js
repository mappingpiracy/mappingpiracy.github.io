var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  sass = require('gulp-sass'),
  inject = require('gulp-inject'),
  uglify = require('gulp-uglify'),
  gconcat = require('gulp-concat'),
  grename = require('gulp-rename'),
  gsourcemaps = require('gulp-sourcemaps'),
  gstripdebug = require('gulp-strip-debug'),
  gcssmin = require('gulp-cssmin'),
  gangulartemplates = require('gulp-angular-templates');

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
  },
  lib: {
    scripts: {
      src: [
        'app/lib/angular/angular.js',
        'app/lib/angular-route/angular-route.js',
        'app/lib/jquery/dist/jquery.js',
        'app/lib/d3/d3.js',
        'app/lib/nvd3/nv.d3.min.js',
        'app/lib/leaflet/dist/leaflet.js',
        'app/lib/file-saver/FileSaver.min.js',
        'app/lib/sheetrock/dist/sheetrock.min.js',
        'app/lib/angular-ui-bootstrap/ui-bootstrap-custom-0.13.3.min.js',
        'app/lib/angular-ui-bootstrap/ui-bootstrap-custom-tpls-0.13.3.min.js',
        'app/lib/moment/min/moment.min.js',
        'app/lib/modernizr/modernizr.js',
        'app/lib/webshim/scripts-webshim/minified/polyfiller.js'
      ],
      min: 'lib.min.js'
    }
  }
};

gulp.task('build', ['scripts-build', 'styles-build', 'lib-build', 'strip-debug', 'inject']);

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
      // paths.build + '/' + paths.lib.scripts.min,
      paths.build + '/' + paths.scripts.min,
      paths.build + '/' + paths.styles.min
    ], {
      read: false
    });
  return target.pipe(inject(sources))
    .pipe(gulp.dest(paths.base));
});

gulp.task('lib-build', function() {
  gulp.src(paths.lib.scripts.src)
    .pipe(gconcat(paths.lib.scripts.min))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
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
  gulp.watch(paths.html.src, function() {
    gulp.src(paths.html.src);
  });
  gulp.watch(paths.scripts.src, ['scripts-build', 'scripts-sourcemaps', 'scripts-inject']);
  gulp.watch(paths.styles.src, ['styles-build', 'styles-sourcemaps']);
});

/**
 * Launches a local webserver to run the angular app
 */
gulp.task('webserver', function() {
  gulp.src(paths.base)
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 9898
    }));
});

gulp.task('default', ['webserver', 'watch', 'scripts-build', 'scripts-sourcemaps', 'inject']);
