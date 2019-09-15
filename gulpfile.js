var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    Az = require('az');
    del = require('del');

 gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass())
        //перенос строки. compressed - все в одну строку (для min.js)
        //expanded - дефолтный перенос (как все пишут обычный код)
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(gulp.dest('app/css'))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

 gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}))
});

 gulp.task('script', function () {
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({stream: true}))
});

// библиотеки css
gulp.task('css', function () {
    return gulp.src([
        'node_modules/normalize.css/normalize.css'
    ])
        .pipe(concat('_libs.sass'))
        .pipe(gulp.dest('app/sass'))
        .pipe(browserSync.reload({stream: true}))
});

//подключать библиотеки
gulp.task('js',function () {
    return gulp.src(['node_modules/az/dist/az.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}))
}) ;

// очищение dist
gulp.task('clean', async function() {
    return del.sync('dist');
});


//плагин для наблюдения. Если изменяется какой-то файл, то
//автоматом срабатывает команда
gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('html'));
    gulp.watch('app/js/*.js', gulp.parallel('script'))
});
//-------------------------------------------------------------------

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        },
        notify: false
    });
});

//запуск
gulp.task('default', gulp.parallel('html','css','sass','js','script','browser-sync', 'watch'));

//собирает проект в dist
gulp.task('prebuild', async function() {
    var buildImg = gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));
    var buildCss = gulp.src('app/css/*.css')
        .pipe(gulp.dest('dist/css'));
    var buildJs = gulp.src('app/js/*.js')
        .pipe(gulp.dest('dist/js'));
    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', gulp.series('clean', 'html', 'css', 'sass', 'script', 'js', 'prebuild'));