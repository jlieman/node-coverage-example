var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var tsify = require("tsify");
var source = require("vinyl-source-stream");
var ts = require('gulp-typescript');
var sourcemaps = require("gulp-sourcemaps");

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', ['build-server'], function() {
    var bundler = browserify({basedir: "src/app/"})
        .add("todoApp.ts")
        .plugin(tsify);

    return bundler.bundle()
        .pipe(source("todo.js"))
        .pipe(gulp.dest("build/public/"));
});

gulp.task('build-server', ['copy-public'], function() {

    return gulp.src(['typings/**/*.d.ts', 'src/server/**/*.ts' ])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write(".", { includeContent: true, sourceRoot: process.cwd() + "/" }))
        .pipe(gulp.dest('build'))
});

gulp.task('copy-public', ['clean'], function() {
    return gulp.src(['src/app/index.html' ])
        .pipe(gulp.dest('build/public'));
});

gulp.task('clean', function() {
    return del(['build']);
});