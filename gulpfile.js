"use strict";

var gulp = require('gulp');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var gulpLivereload = require('gulp-livereload');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var jshint = require("gulp-jshint");
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var args = require('yargs').argv;

var enableJSReload = args.jsreload;
var isDebug = args.debug;
// var env = args.env;

// Paths & files
var path = {
  "public": 'app/public/',
  src: "app/src",
  html: 'app/public/**/*.html',
  sass: 'app/styles/**/*.scss',
  mainSass: 'app/styles/main.scss',
  css: 'app/public/css/',
  vendor: 'app/public/vendor',
  jsDist: 'app/public/js/',

  server: 'bin/server/*.js',
  bin: 'bin/**/*.js'
};

var jsSrcFiles = [
  path.src + '/*.js',
  path.src + '/**/*.js'
];

var jsTestFiles = [
  // Concatenated vendor files
  path.jsDist + "vendor.js",

  // Dist file
  path["public"] + "config/config.js",
  path.jsDist + "app.js",

  // Test files
  path.src + "**/*.spec.js"
];

// Processed differently than source files
// Use min files here rather than uglify (prevents
// errors when vendor files can't be minified properly)
var vendorFiles = [
  path.vendor + "/jquery/jquery.min.js",
  path.vendor + "/lodash/dist/lodash.min.js",
  path.vendor + "/socket.io/socket.io.js"
];

// Ports
var localPort = args.port ? args.port : 7770;
var lrPort = args.lp ? args.lp : 35729;


// Start local server
gulp.task('server', function() {
  var server = connect();

  server.use(connectLivereload({ port: lrPort }));
  server.use(connect.static(path['public']));
  server.listen(localPort);

  console.log("\nlocal server running at http://localhost:" + localPort + "/\n");
});

gulp.task('jshint', function() {
  gulp.src(jsSrcFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshint:server', function() {
  gulp.src(path.server)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Compile js
 *
 * @return {Stream}
 */
gulp.task('js', ['vendorJS'], function() {
  var srcFiles = jsSrcFiles.concat([
    // Ignore test files
    "!**/*.spec.js"
  ]);

  return gulp.src(srcFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.jsDist));
});

/**
 * Concatenate vendor files
 *
 * @return {Stream}
 */
gulp.task('vendorJS', function() {
  return gulp.src(vendorFiles)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(path.jsDist));
});

gulp.task('test', function(done) {
  var karma = require( 'karma' ).server;
  var karmaCommonConf = {
    browsers: isDebug ? ['Chrome'] : ['PhantomJS'],
    frameworks: ['jasmine'],
    files: jsTestFiles
  };

  return karma.start(karmaCommonConf, done);
});

gulp.task('sass', function() {
  gulp.src(path.mainSass)
    .pipe(sass({
      outputStyle: [ 'expanded' ],
      sourceComments: 'normal',
      errLogToConsole: true
    }))
    .pipe(prefix())
    .pipe(gulp.dest(path.css));
});

gulp.task('watch', ['build'], function(done) {
  var lrServer = gulpLivereload();

  gulp.watch([ path.css + '/**/*.css' ])
    .on('change', function(file) {
      lrServer.changed(file.path);
    });

  // Build and test js
  gulp.watch(jsSrcFiles, [
    'js',
    'jshint',
    'test'
  ]);

  gulp.watch(path.server, [
    'jshint:server'
  ]);

  if (enableJSReload) {
    // Only need to watch the compiled js
    gulp.watch([
      path.jsDist + 'app.js',
    ]).on('change', function(file) {
      lrServer.changed(file.path);
    });
  }

  gulp.watch(path.sass, ['sass']);
});

gulp.task('build', ['sass', 'js']);

// default task
gulp.task('default', [ 'server', 'watch' ]);