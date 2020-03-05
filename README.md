[![Build Status](https://travis-ci.org/qprquo/gulp-starter-boilerplate.svg?branch=master)](https://travis-ci.org/qprquo/gulp-starter-boilerplate)

# Gulp-starter-boilerplate

Simple gulp boilerplate for beginners. 

Helps you to automate some common tasks: 
 * minify js and css
 * bundle js (uses webpack)
 * archive dist
 * svg and png sprites assembly
 * Pug templates compilation

## Usage

### Installation

```sh
# Clone repo
git clone https://github.com/qprquo/gulp-starter-boilerplate
# cd to directory
cd gulp-starter-boilerplate
# link package
npm link
# Create project
gulp-starter-boilerplate --create=<name>
# install packages
cd <name> 
npm install

# start some task
gulp watch
```

### Gulp tasks

- `gulp build` - build in development mode (with sourcemaps)
- `gulp prod`  - build in production mode (without sourcemaps)
- `gulp zip`   - archive `${config.dist}` directory
- `gulp watch` - start dev server and watch for changes
- `gulp clean` - clean dist folder

### Configuration
 
Following options are available:
```js
const config = {
  // output directory
  dist: './dist/',
  // minify css and put files in `${config.dist}/css` directory
  minifyCss: true,
  // minify js and put files in `${config.dist}/js` directory
  minifyJs: true,
  // use webpack. If set to `true` then bundles js using config located in project root 
  useWebpack:false
  // compile png sprites located in ./sprites/png directory 
  pngSprites: true,
  // compile svg sprites located in ./sprites/svg directory
  svgSprites: true
}
```

Or you can edit gulpfile.js on your own.
