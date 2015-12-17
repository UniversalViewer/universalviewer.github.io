var c = require('./gulpfile.config');
var config = new c();
var connect = require('gulp-connect');
var fs = require('fs');
var glob = require("glob");
var gulp = require('gulp');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');

function mount(connect, dir) {
    return connect.static(path.resolve(dir));
}

gulp.task('delete', function(cb) {
    fs.unlinkSync('./uv');
    cb();
});

gulp.task('copy', function() {
    return gulp.src('**', { base: './node_modules/universalviewer/dist/uv-*/' })
        .pipe(gulp.dest('./uv'));
});

gulp.task('rename', function(cb) {
    var file = glob.sync('./uv-*/');
    fs.renameSync(file[0], './uv/');
    cb();
});

gulp.task('serve', function() {
    connect.server({
        root: './'
        // middleware: function(connect, opt) {
        //     return [
        //         // serve contents of the dist folder
        //         mount(connect, './')
        //     ]
        // }
    });
});

gulp.task('sync', function(cb) {
    runSequence('delete', 'copy', 'rename', cb);
});