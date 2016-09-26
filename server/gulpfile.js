var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var babel = require('babel-register');
var runSequence = require('run-sequence');
var serverTS = ['../shared/src/**/*.ts', 'src/**/*.ts', 'typings/**/*.ts', 'node_modules/**/*.d.ts'];
var testTS = ['../shared/src/**/*.ts', 'src/**/*.ts', 'typings/**/*.ts', 'node_modules/**/*.d.ts'];


var tsProject = ts.createProject("tsconfig.json", {
    typescript: require('typescript')
});

gulp.task('default', ['compile', 'test', 'watch']);

gulp.task('compile', function() {
    return tsProject
        .src(serverTS, {base: './'})
        .pipe(ts(tsProject))
        .js
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
    return tsProject
        .src(testTS, {base: './'})
        .pipe(ts(tsProject))
        .js
        .pipe(gulp.dest(''))
        .pipe(mocha({
            reporter: 'progress',
            compilers:babel
        }));
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.ts', '../shared/src/**/*.ts'], ['compile', 'test']);
});