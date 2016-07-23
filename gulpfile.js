/* eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browser: ['last 2 version']
		}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
	gulp.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function() {
	gulp.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 8080,
        open: true,
        notify: false
    });
    browserSync.stream();
});

gulp.task('tests', function () {
	gulp.src('tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor:'js/**/*.js'
		}));
});

gulp.task('lint', function () {    
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('copy-html', function () {
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function () {
	gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['copy-html, copy-images, styles', 'lint'], function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['lint']);
	gulp.watch('/index.html', ['copy-html']);
	gulp.watch('./index.html').on('change', browserSync.reload());

	//console.log(process.env);
	 browserSync.init({
        server: './dist'
     });
});