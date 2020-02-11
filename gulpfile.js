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
const spritesmith = require("gulp.spritesmith");
const buffer = require("vinyl-buffer")
const imagemin = require("gulp-imagemin");
const through = require("through2");
const svgSprite = require("gulp-svg-sprite");
const webpack = require("webpack-stream");
const webpackConfig = require("./webpack.config");

const defaults = {
  // destination folder
  dist: "./dist",
  // if set to true - ignores minify js
  useWebpack: false,
  // Should compile css sprites ?
  pngSprites: false,
  // Should docmpile png sprites ?
  svgSprites: false,
  // Should minify Css?
  minifyCss: true,
  // Should minify Js?
  minifyJs: true
}

const config = { ...defaults, ...userConfig };

// sass compiler
sass.compiler = require("node-sass");

const empty = () => {
  const th = through.obj((file, enc, cb) => {
    cb(null, file)
  });
  return gulp.src(".").pipe(th);
}

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

const js = (mode = "none") => {
  return () => {
    const dest = config.dist + "/js";

    if (config.useWebpack) {
      const options = {
        mode,
        devtool: (mode !== "production" ? "source-map" : false)
      };

      return gulp
        .src(".")
        .pipe(plumber())
        .pipe(webpack({ ...options, ...webpackConfig }))
        .pipe(gulp.dest(dest));
    }

    let stream = gulp
      .src("./src/js/**/*.js")
      .pipe(plumber());

    if (config.minifyJs) {
      stream = stream
        // copy unminified js
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }));
    }

    return stream
      .pipe(gulp.dest(dest))
      .pipe(browsersync.stream());
  }
}

const images = () => {
  const dest = config.dist + "/images"
  return gulp
    .src("./src/images/*")
    .pipe(gulp.dest(dest));
}

const vendor = () => {
  const dest = config.dist + "/vendor";
  const jquery = gulp
    .src([
      "./node_modules/jquery/dist/*",
      "!./node_modules/jquery/dist/core.js",
    ])
    .pipe(gulp.dest(dest));

  return merge(jquery);
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
    .pipe(browsersync.stream());
}

const pngSprites = () => {
  if (!config.pngSprites) {
    return empty();
  }

  const spriteData = gulp
    .src("./sprites/png/**/*.png")
    .pipe(spritesmith({
      imgName: "sprite.png",
      cssName: "_sprite.scss",
    }));

  const imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest("./images"));

  const cssStream = spriteData.css
    .pipe(gulp.dest("./src/scss"))

  return merge(imgStream, cssStream);
}

const svgSprites = () => {
  if (!config.svgSprites) {
    return empty();
  }

  return gulp.src("./sprites/svg/**/*.svg")
    .pipe(svgSprite({
      shape: {
        dimension: {
        }
      },
      mode: {
        defs: {
          dest: "./",
          sprite: "./sprite.svg",
        }
      }
    }))
    .pipe(gulp.dest("./images"));

}
const watch = () => {
  gulp.watch("./src/scss/**/*.scss");
  gulp.watch("./src/js/**/*.js");
  gulp.watch("./src/pug/**/*.pug");
}

// Tasks

// complex tasks
const sprites = gulp.parallel(pngSprites, svgSprites);
const build = gulp.series(clean, gulp.parallel(vendor, images, sprites), gulp.parallel(css, js(), html));
const prod = gulp.series(clean, gulp.parallel(vendor, images, sprites), gulp.parallel(css, js("production"), html));

// sprites 
exports.sprites = sprites;

// css
exports.css = css;

// js
exports.js = js();

//pug
exports.html = html;

// clean
exports.clean = clean;

// copy vendor files
exports.vendor = vendor;

// copy images
exports.images = images;

// build tas
exports.build = build;

exports.prod = prod;
// watch
exports.watch = gulp.series(build, gulp.parallel(watch, browserSync));