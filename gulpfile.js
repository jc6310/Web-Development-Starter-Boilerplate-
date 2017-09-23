var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var header  = require('gulp-header');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'public'
        },
    })
});

gulp.task('sass', function() {
    return gulp.src('dev/scss/**/*.scss') 
        .pipe(sass())
        .pipe(gulp.dest('dev/css'))
});
gulp.task('css', function () {
    return gulp.src('dev/css/styles.css')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('dev/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('dev/js/*.js')
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('images', function() {
    return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('public/assets/images'));
});

gulp.task('fonts', function() {
    return gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('clean', function() {
    return del.sync('public/assets');
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch('dev/scss/**/*.scss', ['sass']);
    gulp.watch('dev/css/*.css', ['css']);
    gulp.watch('dev/js/*.js', ['js']);
    gulp.watch('dev/images/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
    gulp.watch('public/*.html', browserSync.reload);
});

gulp.task('bower', function() {
  return bower('./bower_components')
    .pipe(gulp.dest('public/assets/lib'))
});

gulp.task('build', function (callback) {
  runSequence('clean',
    ['sass', 'css', 'js', 'images', 'fonts'],
    callback
  )
});

gulp.task('default', function (callback) {
    runSequence('clean',['sass','css','js','images','bower','browser-sync', 'watch'],
        callback
    )
});
