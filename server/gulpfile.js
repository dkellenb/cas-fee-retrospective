var gulp = require('gulp');
var ts = require('gulp-typescript');
var serverTS = ["src/**/*.ts", "typings/**/*.ts", "node_modules/**/*.d.ts"];


var tsProject = ts.createProject("tsconfig.json", {
    typescript: require('typescript')
});

gulp.task('default', ['ts', 'watch']);

gulp.task('ts', function() {
    return tsProject
        .src(serverTS, {base: './'})
        .pipe(ts(tsProject))
        .js
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.ts', ['ts']);
});