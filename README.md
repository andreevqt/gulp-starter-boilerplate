# Gulp starter

Simple gulp boilerplate for beginners

## Usage

### Gulp tasks

- `gulp build` - build in development mode (with sourcemaps)
- `gulp prod`  - build in production mode (without sourcemaps)
- `gulp zip`   - archive `config.dist` directory
- `gulp watch` - start dev server and watch for changes
- `gulp clean` - clean dist forlder

### Configuration
 
Configuration file `config.js` can be found in project root directory

Following options are available:
 * dist - default: `./`, minify css and put files in `${config.dist}/css` directory
 * minifyCss - default: `true`, minify css and put files in `${config.dist}/css` directory
 * minifyJs - default: `true`,  minify js and put files in `${config.dist}/js` directory
 * useWebpack - default: `false`, use webpack. If set to `true` then bundles js using config located at project root directory