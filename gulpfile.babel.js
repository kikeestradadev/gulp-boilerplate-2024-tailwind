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
        .pipe(data(() => getJsonData()))  // Usamos la función para obtener datos
        .pipe(pug({
            pretty: true  // Asegura que el HTML no esté minificado
        }))
        .pipe(cacheBust({  // Aplicamos cache busting aquí
            type: 'timestamp'  // Usamos timestamp para asegurar la actualización de cache
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('sass', () => {
    return gulp.src('src/scss/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            tailwindcss(),  // Simplificamos la configuración de tailwind
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
    return browserify('src/js/index.js')
        .transform(babelify)
        .bundle()
        .pipe(source('index.js'))  // Mantén el nombre original
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(minify({
            ext: {
                min: '.js'  // Mantén la extensión .js sin agregar .min
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/'));  // Coloca el archivo en public/
});

gulp.task('serve', gulp.series('pug', 'sass', 'scripts', () => {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    });

    // Agregamos el watch para tailwind.config.js
    gulp.watch('tailwind.config.js', gulp.series('sass')).on('change', browserSync.reload);
    gulp.watch('src/pug/**/*.pug', gulp.series('pug', 'sass')).on('change', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', gulp.series('sass')).on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js', gulp.series('scripts')).on('change', browserSync.reload);
    gulp.watch('src/data/**/*.json', gulp.series('pug')).on('change', browserSync.reload);
    gulp.watch('src/md/**/*.md', gulp.series('pug')).on('change', browserSync.reload);
}));

gulp.task('dev', gulp.series('serve'));
gulp.task('build', gulp.series('pug', 'sass', 'scripts'));
gulp.task('default', gulp.series('dev'));
