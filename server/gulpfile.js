var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var serverTS = ["../shared/src/**/*.ts", "src/**/*.ts", "typings/**/*.ts", "node_modules/**/*.d.ts"];


var tsProject = ts.createProject("tsconfig.json", {
    typescript: require('typescript')
});

gulp.task('default', ['ts', 'watch']);

gulp.task('ts', function() {
    return tsProject
        .src(serverTS, {base: './'})
        .pipe(ts(tsProject))
        .js
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.ts', '../shared/src/**/*.ts'], ['ts']);
});