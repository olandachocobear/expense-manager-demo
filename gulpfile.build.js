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

const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const vulcanize = require('gulp-vulcanize');
const crisper = require('gulp-crisper');
var concat = require('gulp-concat');

const runSequence = require('run-sequence');

const buildDirectory = 'build';

const war = require('gulp-war');
const zip = require('gulp-zip');

gulp.task('default', function () {
    gulp.src([
        "**/*.html",
        "**/*.js",
        "bower_components/*.*" ,
        "manifest.json",
	    "**/*.png",
        "**/*.gif",
        ])
        .pipe(war({
            welcome: 'index.html',
            displayName: 'Loyalty Manual Redeem',
        }))
        .pipe(zip('voucher-redeem.war'))
        .pipe(gulp.dest("./dist"));

});
