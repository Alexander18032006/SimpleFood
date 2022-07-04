const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
var notify = require("gulp-notify");
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const browserSync = require('browser-sync').create();
const replace = require('gulp-replace');
const fileInclude = require('gulp-file-include');
function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		notify: false
	})
}

const htmlInclude = () => {
	return src(['app/html/*.html']) // Находит любой .html файл в папке "html", куда будем подключать другие .html файлы													
		.pipe(fileInclude({
			prefix: '@',
			basepath: '@file',
		}))
		.pipe(dest('app')) // указываем, в какую папку поместить готовый файл html
		.pipe(browserSync.stream());
}

function style() {
	return src('app/scss/style.scss')
		.pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError))
		.on('error', notify.onError({
			title: 'Scss error'
		}))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: true
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/mixitup/dist/mixitup.js',
		'app/js/main.js'
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function cleanDist() {
	return del('dist')
}
function build() {
	return src([
		'app/**/*.html',
		'app/css/style.min.css',
		'app/js/main.min.js'
	], { base: 'app' })
		.pipe(dest('dist'))
}
function images() {
	return src('app/images/**/*.*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('dist/images/'))
}
function svgSprites() {
	return src('app/images/icons/*.svg')
		.pipe(cheerio({
			run: ($) => {
				$("[fill]").removeAttr("fill");
				$("[stroke]").removeAttr("stroke");
				$("[style]").removeAttr("style");
			},
			parserOptions: { xmlMode: true },
		})
		)
		.pipe(replace('&gt;', '>')) // боремся с заменой символа 
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg',
					},
				},
			})
		)
		.pipe(dest('app/images'));
}

function watching() {
	watch(['app/html/**/*.html'], htmlInclude);
	watch(['app/scss/**/*.scss'], style);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch(['app/**/*.html']).on('change', browserSync.reload);
	watch(['app/images/icons-2/*.svg'], svgSprites);
}

exports.htmlInclude = htmlInclude;
exports.style = style;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.images = images;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.svgSprites = svgSprites;
exports.build = series(cleanDist, images, build);

exports.default = parallel(htmlInclude, style, scripts, browsersync, svgSprites, watching);

