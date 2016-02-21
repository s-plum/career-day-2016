var gulp = require('gulp'),
    argv = require('yargs').argv,
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    compass = require('gulp-compass'),
    del = require('del'),
    fs = require('extfs'),
    gulpIf = require('gulp-if'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    webserver = require('gulp-webserver');

var onError = function (err) {  
    console.log(err.toString());
};

var jsHintConfig = {
    loopfunc: true,
    predef: ['define','require'],
    devel: true,
    browser: true
};

var shouldMinify = argv.minify,
    shouldWatch = argv.watch,
    srcDir = 'src',
    distDir = 'public'

var buildTasks = ['scripts', 'sassy', 'images'];

if (shouldWatch) {
    buildTasks.push('watch');
}

gulp.task('watch:scripts', function() {
    watch([srcDir + '/js/**/*.js', '!' + srcDir + '/js/plugins/**/*.js'], function(files) {
        gulp.src([srcDir + '/js/**/*.js', '!' + srcDir + '/js/plugins/**/*.js'])
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(jshint(jsHintConfig))
            .pipe(jshint.reporter('jshint-stylish'));
        gulp.start('scripts');
    });
});

gulp.task('watch:images', function() {
    watch([srcDir + '/img/**'], function(files) {
        gulp.start('images');
    });
});

gulp.task('watch:sass', function() {
    watch([srcDir + '/sass/**/*.scss'], function(files) {
        gulp.start('sassy');
    });
});

gulp.task('watch', ['watch:scripts','watch:images', 'watch:sass']);

gulp.task('clean:sass', function (cb) {
    del([distDir + '/css/**/*'], cb)
});

gulp.task('clean:images', function (cb) {
    if (!fs.isEmptySync(distDir + '/img/**/*')) {
        del([distDir + '/img/**/*'], cb)
    }
    else {
        cb();
    }
});

gulp.task('clean:scripts', function (cb) {
    del([distDir + '/js/**/*'], cb)
});

gulp.task('scripts', function() {
    var scripts = fs.readdirSync('./' + srcDir + '/js').filter(function(n) {
    return fs.statSync('./' + srcDir + '/js/' + n).isFile();
    }).map(function(n) {
    return browserify('./' + srcDir + '/js/' + n)
    .bundle()
    .pipe(source(n.replace('.js', '') + '.min.js'))
    .pipe(gulpIf(shouldMinify, streamify(uglify())))
    .pipe(gulp.dest(distDir + '/js'))
    .pipe(gulpIf(shouldWatch, livereload()));
    }); 
});

gulp.task('sassy', function() {
    gulp.src([srcDir + '/sass/**/*.scss'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(compass({
            config_file: './config.rb',
            css: './' + distDir + '/css',
            sass: './' + srcDir + '/sass',
            sourcemap: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./' + distDir + '/css'))
        .pipe(gulpIf(shouldWatch, livereload()));
});

gulp.task('images', ['clean:images'], function() {
    gulp.src([srcDir + '/img/**'])
        .pipe(gulp.dest('./' + distDir + '/img'))
        .pipe(gulpIf(shouldWatch, livereload()));
});

gulp.task('serve', buildTasks, function() {
    nodemon({
        script: 'bin/www.js',
        ext: 'js jade',
        ignore: ['src/js/**/*.js', 'public/js/**/*.js']
    });
});

gulp.task('build', buildTasks, function() {});