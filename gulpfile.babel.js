import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import sassCompiler from 'sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import minify from 'gulp-minify';
import data from 'gulp-data';
import fs from 'fs';
import path from 'path';
import cacheBust from 'gulp-cache-bust';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import'; 

// Set the Sass compiler
const sass = gulpSass(sassCompiler);

// Función para leer todos los archivos JSON en un directorio
const getJsonData = () => {
    const dataDir = './src/data/';
    const files = fs.readdirSync(dataDir);
    let jsonData = {};

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const fileData = fs.readFileSync(path.join(dataDir, file));
            Object.assign(jsonData, JSON.parse(fileData));
        }
    });

    return jsonData;
};

// Tarea pug
gulp.task('pug', () => {
    return gulp.src('./src/pug/pages/**/*.pug')
        .pipe(plumber())
        .pipe(data(() => getJsonData()))
        .pipe(pug({
            pretty: true
        }))
        .pipe(cacheBust({
            type: 'timestamp'
        }))
        .pipe(gulp.dest('public'));
});

// Tarea para compilar Sass y guardarlo en src/scss
gulp.task('sass', () => {
    return gulp.src('src/scss/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        // .pipe(postcss([cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/scss/'));
});

// Tarea para Tailwind CSS, incluyendo postcss-import
gulp.task('tailwind', () => {
    console.log('Compilando Tailwind CSS...');
    return gulp.src('src/scss/tailwind.css')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(postcss([
            postcssImport(),                     // Permite importar styles.css dentro de tailwind.css
            tailwindcss('./tailwind.config.js'),
            autoprefixer(),
            // cssnano()                            // Minifica el CSS
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/'))           // Guarda el archivo en public/css
        .on('end', () => console.log('Tailwind CSS compilado correctamente.'));
});

// Tarea para compilar JavaScript con Browserify y Babelify
gulp.task('scripts', () => {
    return browserify('src/js/index.js')
        .transform(babelify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(minify({
            ext: {
                min: '.js'
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/'));
});

// Tarea para iniciar el servidor y observar cambios en tiempo real
gulp.task('serve', gulp.series('pug', 'sass', 'tailwind', 'scripts', () => {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    });

    gulp.watch('src/pug/**/*.pug', gulp.series('pug')).on('change', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', gulp.series('sass')).on('change', browserSync.reload);
    gulp.watch(['src/scss/tailwind.css', './public/**/*.html'], gulp.series('tailwind')).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', gulp.series('scripts')).on('change', browserSync.reload);
    gulp.watch('src/data/**/*.json', gulp.series('pug')).on('change', browserSync.reload);
    gulp.watch('src/md/**/*.md', gulp.series('pug')).on('change', browserSync.reload);
}));

// Tareas principales
gulp.task('dev', gulp.series('serve'));
gulp.task('build', gulp.series('pug', 'sass', 'tailwind', 'scripts'));
gulp.task('default', gulp.series('dev'));
