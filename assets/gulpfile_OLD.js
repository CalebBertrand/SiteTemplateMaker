var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
    return gulp.src('sass/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
  })
});

gulp.task('imgs', function(){
  return gulp.src('build/imgs/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('build/min/imgs'))
});

gulp.task('clean:min', function () {
    return del.sync('build/min');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('uglify', function () {
    return gulp.src('build/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/min/js'))
});

gulp.task('default', ['browserSync', 'sass'], function () {
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('build/*.html', browserSync.reload);
    gulp.watch('build/js/**/*.js', browserSync.reload);
});

gulp.task('compress', function (callback) {
    runSequence('clean:min',
        ['sass', 'imgs', 'uglify'],
        callback
    )
});