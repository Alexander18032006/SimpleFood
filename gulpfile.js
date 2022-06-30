const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
var notify = require("gulp-notify");
const browserSync = require('browser-sync').create();

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		notify: false
	})
}

function style() {
	return src('app/scss/style.scss')
		.pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError))
		.on('error', notify.onError({
			title: 'Scss error',
			message: "Reason: <%= error.message %>",
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
function watching() {
	watch(['app/scss/**/*.scss'], style);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
	watch(['app/**/*.html']).on('change', browserSync.reload)
}

exports.style = style;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.images = images;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);

exports.default = parallel(style, scripts, browsersync, watching);
