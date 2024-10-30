const gulp = require("gulp");
const webpack = require("webpack");
const path = require('path');

const distPath = __dirname+'/dist'
const change = require("gulp-change");
var gclean = require("gulp-clean");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');

function createCompiler(settings){
    return webpack({
        mode: settings.mode,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: "./client/tsconfig.json"
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.s?css$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|woff|ttf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {}
                        }
                    ]
                }
            ]
        },
        devtool: settings.devtool,
        entry: settings.entry,
        resolve: {
            modules: [
                "node_modules"
            ],
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        target: "web",
        output: settings.output,
        optimization: settings.optimization
    });

}

function releaseEditor(done){
    const comp = createCompiler({
        devtool: false,
        entry: {
            chartplot: "./client/src/wordpress/index.ts",
            tinymce: "./client/src/wordpress/tinymce.tsx",
            post: './client/src/wordpress/post.ts'
        },
        output: {
            path: distPath+"/js",
            filename: '[name].min.js'
        },
        mode: "production",
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        chunks: 'initial',
                        name: 'vendor',
                        enforce: true
                    },
                }
            }
        }
    });
    comp.run((err, stats) => {
        done(err || null);
    });
}

function parseDependency(path){
    var config = require(path);
    var name = config.name.substr(13);
    if (config.reactivelib){
        if (config.reactivelib.name){
            return {
                name: name,
                shortname: config.reactivelib.name,
                version: config.version
            }
        }
    }
    return {
        name: name, shortname: name, version: config.version
    }
}

function copyrightGPL(s, version){
    return `/**
 * Chartplot lets you create charts am embed them into your websites. See chartplot.com for more information.
 *
 * Copyright 2016-2019 Christoph Rodak <christoph@rodak.li>
 *
 * Version v${version}
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 *
 */
 
${s}
`
}

function cleanDistWordpress(){
    return gulp.src(distPath, {allowEmpty: true}).pipe(gclean({force: true}));
}

function addCopyright({file}){
    var pack = parseDependency("./client/package.json");
    return function(){
        return gulp.src([file])
            .pipe(change(s => copyrightGPL(s, pack.version)))
            .pipe(gulp.dest(distPath+"/js"));
    }
}

gulp.task("release:wordpress:css", () => {
    return gulp.src("./client/assets/css/editor.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([require('postcss-flexbugs-fixes')]))
        .pipe(autoprefixer({
            browsers: ['> 1%']
        }))
        .pipe(csscomb())
        .pipe(rename('chartplot.css'))
        .pipe(csso())
        .pipe(gulp.dest(distPath+"/css/"));
});


gulp.task("build", gulp.parallel(gulp.series(cleanDistWordpress, releaseEditor,
    addCopyright({file: distPath+"/js/tinymce.min.js"}),
    addCopyright({file: distPath+"/js/chartplot.min.js"}),
    addCopyright({file: distPath+"/js/post.min.js"})), 'release:wordpress:css'));