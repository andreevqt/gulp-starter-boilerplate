[![Build Status](https://travis-ci.org/qprquo/gulp-starter.svg?branch=master)](https://travis-ci.org/qprquo/gulp-starter)

# Gulp starter

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
# Install globally
npm i gulp-starter -g

# Create project
gulp-starter --create=<name>

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
 
Configuration file `config.js` can be found in a project root directory

Following options are available:
```js
module.exports = {
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
