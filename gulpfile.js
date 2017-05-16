var gulp = require('gulp'),
	sass = require('gulp-sass'),//sass
    notify = require('gulp-notify'),//提示信息
    minifycss = require('gulp-minify-css'),//css压缩
    uglify = require('gulp-uglify'),//js压缩
    browserSync = require('browser-sync').create(),//刷新页面
    reload = browserSync.reload;
var _baseDir = './src/';

gulp.task('client', function() {
	browserSync.init({
        server: _baseDir
    });
    gulp.watch(_baseDir + "/**").on('change', reload);
});

//sass
gulp.task('sass', function () {
    return gulp.src(_baseDir + 'assets/scss/**/*.scss')
        //输出格式：expanded  compact
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(gulp.dest(_baseDir + 'assets/css'));
});


//默认任务清空刷新监听
gulp.task('default', ['client', 'sass'], function () {
    gulp.watch(_baseDir + 'assets/scss/**/*.scss',['sass']);
    browserSync.reload();
});