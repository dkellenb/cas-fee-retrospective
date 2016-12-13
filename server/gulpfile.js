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
    replace         = require('gulp-replace'),
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
    __dirname + '/src/**/**.ts'
];
var srcTest = [
    __dirname + '/test/**/**.ts'
];
var srcAll = srcApp.concat(srcTest);

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
    var tsResult = gulp.src(['src/**/*.ts',
        '../client/src/app/**/shared/model/*.ts',
        '../client/src/app/**/shared/model/**/*.ts',
        '../client/src/app/**/shared/util/*.ts'])
        .pipe(tsc(tsProject));
    return tsResult.js
        .pipe(replace('../../client/src/app/shared/', 'shared/'))
        .pipe(gulp.dest(__dirname + '/build/'));
});

gulp.task('build', function (cb) {
    sequence('build-source', 'lint')(cb)
});


//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task('default', function (cb) {
    sequence('del', 'build-source', 'lint')(cb)
});

gulp.task('watch', function() {
    gulp.watch(srcAll, ['default']);
});