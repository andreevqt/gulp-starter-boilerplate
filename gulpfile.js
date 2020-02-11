const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const cleanCss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const pug = require("gulp-pug");
const merge = require("merge-stream");
const userConfig = require("./config");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync");

const defaults = {
  dist: "./dist",
  useWebpack: false,
  pngSprites: false,
  svgSprites: false,
  minifyCss: true,
  minifyJs: true
}

const config = { ...userConfig, ...defaults };

// sass compiler
sass.compiler = require("node-sass");

const clean = () => {
  return del([config.dist]);
}

const css = () => {
  const dest = config.dist + "/css";
  let stream = gulp
    .src("./src/scss/**/*.scss")
    .pipe(plumber())
    // sass
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .on("error", sass.logError)
    // prefix
    .pipe(autoprefixer({
      cascade: false
    }))

  if (config.minifyCss) {
    stream = stream
      // copy unminified css
      .pipe(gulp.dest(dest))
      .pipe(cleanCss())
      .pipe(rename({
        suffix: ".min"
      }))
  }

  return stream
    .pipe(gulp.dest(dest))
    .pipe(browsersync.stream());
}

const js = () => {
  const dest = config.dist + "/js";
  let stream = gulp
    .src("./src/js/**/*.js")
    .pipe(plumber());

  if (config.minifyJs) {
    stream = stream
      // copy unminified js
      .pipe(gulp.dest(dest))
      .pipe(uglify())
      .pipe(rename({ suffix: ".min" }))
  }

  return stream
    .pipe(gulp.dest(dest))
    .pipe(browsersync.stream());
}

const images = () => {
  const dest = config.dist + "/images"
  return gulp
    .src("./src/images/*")
    .pipe(gulp.dest(dest))
}

const vendor = () => {
  const dest = config.dist + "/vendor";
  const jquery = gulp
    .src([
      "./node_modules/jquery/dist/*",
      "!./node_modules/jquery/dist/core.js",
    ])
    .pipe(gulp.dest(dest))

  return merge(jquery)
}

const browserSync = (done) => {
  browsersync.init({
    server: {
      baseDir: config.dist
    },
    port: 8000
  });
  done();
}


const browserSyncReload = (done) => {
  browsersync.reload();
  done();
}


const html = () => {
  const dest = config.dist;
  return gulp
    .src("./src/pug/pages/**/*.pug")
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(dest))
}


const watch = () => {
  gulp.watch("./src/scss/**/*.scss");
  gulp.watch("./src/js/**/*.js");
  gulp.watch("./src/pug/**/*.pug");
}


// Tasks

const build = gulp.series(clean, gulp.parallel(vendor, images), gulp.parallel(css, js, html));

// css
exports.css = css;

// js
exports.js = js;

//pug
exports.html = html;

// clean
exports.clean = clean;

// copy vendor files
exports.vendor = vendor;

// copy images
exports.images = images;

// complex tasks
exports.build = build;

// watch
exports.watch = gulp.series(build, gulp.parallel(watch, browserSync));