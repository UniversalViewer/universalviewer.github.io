var async = require('async');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var fs = require('fs');
var glob = require("glob");
var gulp = require('gulp');
var header = require('gulp-header');
var less = require('gulp-less');
var pkg = require('./package.json');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/styles.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('css/styles.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/index.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('sync', function(cb) {

    async.series([
        function (next) {
            gulp.src(['node_modules/universalviewer/dist/uv-*/**'])
            .pipe(gulp.dest('vendor'))
            .on('end', next);
        },
        function (next) {
            gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
            .pipe(gulp.dest('vendor/bootstrap'))
            .on('end', next);
        },
        function (next) {
            gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
            .pipe(gulp.dest('vendor/jquery'))
            .on('end', next);
        },
        function (next) {
            gulp.src(['node_modules/magnific-popup/dist/*'])
            .pipe(gulp.dest('vendor/magnific-popup'))
            .on('end', next);
        },
        function (next) {
            gulp.src(['node_modules/scrollreveal/dist/*.js'])
            .pipe(gulp.dest('vendor/scrollreveal'))
            .on('end', next);
        },
        function (next) {
            gulp.src([
                'node_modules/font-awesome/**',
                '!node_modules/font-awesome/**/*.map',
                '!node_modules/font-awesome/.npmignore',
                '!node_modules/font-awesome/*.txt',
                '!node_modules/font-awesome/*.md',
                '!node_modules/font-awesome/*.json'
            ])
            .pipe(gulp.dest('vendor/font-awesome'))
            .on('end', next);
        },
        function (next) {
            gulp.src(['node_modules/extensions/dist/extensions.js'])
            .pipe(gulp.dest('vendor/extensions'))
            .on('end', next);
        },
        function (next) {
            gulp.src(['node_modules/jquery-plugins/dist/jquery-plugins.js'])
            .pipe(gulp.dest('vendor/jquery-plugins'))
            .on('end', next);
        },
        function (next) {
            gulp.src(['node_modules/utils/dist/utils.js'])
            .pipe(gulp.dest('vendor/utils'))
            .on('end', next);
        }
    ], cb);
});

gulp.task('clean', function(cb) {
    return del('vendor/uv');
});

gulp.task('rename', function(cb) {
    var file = glob.sync('vendor/uv-*/');
    fs.renameSync(file[0], 'vendor/uv/');
    cb();
});

gulp.task('default', function(cb) {
    runSequence('clean', 'less', 'minify-css', 'minify-js', 'sync', 'rename', cb);
});

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});