'use strict';

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp            = require('gulp'),
    tslint          = require('gulp-tslint'),
    tsc             = require('gulp-typescript'),
    sequence        = require('gulp-sequence'),
    concat          = require('gulp-concat'),
    mocha           = require('gulp-mocha'),
    del             = require('del'),
    babel           = require('babel-register'),
    reflectMetadata = require('reflect-metadata'); // needed for typescript compilation


//******************************************************************************
//* FILES
//******************************************************************************

var srcExternal = [
    'typings/**/*.ts', 'node_modules/**/*.d.ts'
];
var srcApp = [
    __dirname + '/src/**/**.ts',
    __dirname + '../shared/src/**/**.ts'
];
var srcTest = [
    __dirname + '/test/**/**.ts',
    __dirname + '../shared/test/**/**.ts'
];
var srcAll = srcApp.concat(srcTest);
var srcCompileApp = srcApp.concat(srcExternal);
var srcCompileTest = srcApp.concat(srcTest).concat(srcExternal);

//******************************************************************************
//* LINT
//******************************************************************************
gulp.task('lint', function() {
    return gulp.src(srcAll)
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report())
});


//******************************************************************************
//* BUILD
//******************************************************************************

var tsProject = tsc.createProject('tsconfig.json', {
    typescript: require('typescript')
});

gulp.task('del', function() {
    return del(__dirname + '/build/');
});

gulp.task('build-source', function() {
    return tsProject.src()
        .pipe(tsc(tsProject))
        .js
        .pipe(gulp.dest(__dirname + '/build/'));
});

gulp.task('build', function (cb) {
    sequence('build-source', 'lint')(cb)
});


//******************************************************************************
//* TEST
//******************************************************************************

gulp.task('test', function (cb) {
    sequence('build-source', 'run-tests')(cb)
});

gulp.task('run-tests', function() {
    return gulp.src(__dirname + '/build/**/*.spec.js')
        .pipe(mocha({
            reporter: 'progress',
            compilers:babel
        }));
});



//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task('default', function (cb) {
    sequence('del', 'build-source', 'lint', 'run-tests')(cb)
});

gulp.task('watch', function() {
    gulp.watch(srcAll, ['default']);
});