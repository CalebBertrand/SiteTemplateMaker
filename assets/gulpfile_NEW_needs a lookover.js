const gulp = require('gulp'),
      browserSync = require('browser-sync'),
      gulp_sass = require('gulp-sass'),
      gulp_imagemin = require('gulp-imagemin'),
      gulp_uglify = require('gulp-uglify'),
      compiler = require('webpack'),
      webpack = require('webpack-stream');

      
const _server = browserSync.create();

exports.sass = () => {
    return gulp.src('./sass/**/*.scss')
        .pipe(gulp_sass().on('error', gulp_sass.logError))
        .pipe(gulp.dest('./build/css'));
        // .pipe(_server.stream());
}

const imagemin = () => {
    return gulp.src(['./assets/imgs/**/*.png', './assets/imgs/**/*.jpg', './assets/imgs/**/*.jpeg', './assets/imgs/**/*.gif'])
        .pipe(gulp_imagemin())
        .pipe(gulp.dest('./build/imgs'));
}

exports.serve = (done) => {
    _server.init({
        server: {
            baseDir: './build'
        }
    });
    webpack( require('./webpack.config.js'), compiler )
    sass();
    gulp.watch('./sass/**/*.scss').on('change', sass);
    gulp.watch('**/*.html').on('change', _server.reload);
    gulp.watch('./js/**/*.js').on('change', gulp.series(() => { webpack( require('./webpack.config.js'), compiler ) }, _server.reload));
    done();
}

// exports.build = (done) => {
//     gulp.parallel(sass(), prodPack(), imagemin());
//     done();
// }