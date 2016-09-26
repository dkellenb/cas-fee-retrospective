'use strict';

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp            = require('gulp'),
    tslint          = require('gulp-tslint'),
    tsc             = require('gulp-typescript'),
    concat          = require('gulp-concat'),
    mocha           = require('gulp-mocha'),
    babel           = require('babel-register'),
    runSequence     = require('run-sequence');


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
gulp.task("lint", function() {
    return gulp.src(srcAll)
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
});


//******************************************************************************
//* BUILD
//******************************************************************************

var tsProject = tsc.createProject("tsconfig.json", {
    typescript: require('typescript')
});

/*var tsProject = tsc.createProject({
    removeComments : false,
    noImplicitAny : false,
    target : "ES5",
    module : "amd",
    declarationFiles : false
});*/


gulp.task("build-source", function() {
    return tsProject.src()
        .pipe(tsc(tsProject))
        .js
        .pipe(gulp.dest(__dirname + "/build/"));
});

gulp.task("build", function(cb) {
    runSequence("lint", "build-source", cb);
});


//******************************************************************************
//* TEST
//******************************************************************************

gulp.task('test', function() {
    return tsProject.src()
        .pipe(tsc(tsProject))
        .js
        .pipe(mocha({
            reporter: 'progress',
            compilers:babel
        }));
});



//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("default", function (cb) {
    runSequence(
        "lint",
        "build-source",
        cb);
});

gulp.task('watch', function() {
    gulp.watch(srcAll, ['default']);
});