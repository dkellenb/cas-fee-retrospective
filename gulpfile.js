'use strict';

/**
 * Gulp file created for easy startup of the application based on this source code.
 *
 * Typically you want to execute:
 * - initial
 * - start
 */
var gulp            = require('gulp'),
    gulpClean       = require('gulp-clean'),
    gulpSequence    = require('gulp-sequence'),
    spawn           = require('child_process').spawn,
    del             = require('del');


var install = require("gulp-install");


gulp.task('client-gulpClean', function() {
    return del(__dirname + '/client/dist/')
});
gulp.task('client-install', function () {
    return gulp.src(['./client/package.json'])
        .pipe(install());
});
gulp.task('client-build', function (cb) {
    process.chdir('client');
    var ngBuild = spawn('ng', ['build', 'prod'], {stdio: 'inherit'});
    ngBuild.on('close', function (code) {
        if (code !== 0) {
            console.log('ng build exited with code ' + code);
            cb(code);
        }
        cb();
    });
});

gulp.task('server-clean', function() {
    gulp.src(['server/src/**/*.js', 'server/src/**/*.map'])
        .pipe(gulpClean());
});
gulp.task('server-install', function() {
    return gulp.src(['/server/pacakge.json'])
       .pipe(install());
});
gulp.task('server-start', function() {
    process.chdir('server');
    var ngBuild = spawn('ts-node', ['./src/server.ts'], {stdio: 'inherit'});
    ngBuild.on('close', function (code) {
        if (code !== 0) {
            console.log('Server broke with error code ' + code);
            return
        }
        console.log('Server stopped');
    });
});

gulp.task('initial',
    gulpSequence(
        ['client-gulpClean', 'server-clean'],
        'client-install',
        'server-install',
        'client-build'
    )
);
gulp.task('run', ['server-start']);
