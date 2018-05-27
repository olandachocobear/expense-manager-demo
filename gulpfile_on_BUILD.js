/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const mergeStream = require('merge-stream');
const polymerBuild = require('polymer-build');

// Here we add tools that will be used to process our source files.
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const vulcanize = require('gulp-vulcanize');
const crisper = require('gulp-crisper');
var concat = require('gulp-concat');

const runSequence = require('run-sequence');

// Additional plugins can be used to optimize your source files after splitting.
// Before using each plugin, install with `npm i --save-dev <package-name>`
// const uglify = require('gulp-uglify');
// const cssSlam = require('css-slam').gulp;
// const htmlMinifier = require('gulp-html-minifier');

const buildDirectory = 'build';

const war = require('gulp-war');
const zip = require('gulp-zip');

gulp.task('default', function () {
    gulp.src([
        "**/*.html",
        "**/*.js",
        "bower_components/*.*" ,
        ])
        .pipe(war({
            welcome: 'index.html',
            displayName: 'Loyalty Manual Redeem',
        }))
        .pipe(zip('ManualRedeem.zip'))
        .pipe(gulp.dest("./dist"));

});
