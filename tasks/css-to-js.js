/*
 * css-to-js
 * https://github.com/45629Ar/grunt
 *
 * Copyright (c) 2018 Arshdeep Soni
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('css-to-js', 'Converts HTML template files to JS', function () {
		// build options and save against grunt instance (this)
		const options = this.options({
			template: 'grunt-configs/html-to-js.tmpl',
			ext: '.js',
			excludePathRegex: '',
			excludeFiles: [],
			deleteFilesExcept: []
		});


		// read template from template path
		const template = grunt.file.read(options.template);

		// loop through folders and find files
		this.files.forEach(function (f) {
			f.src.forEach(function (filepath, index) {
				let path = filepath.replace(new RegExp(options.excludePathRegex), '');

				if ( options.excludeFiles.indexOf(path) > -1 ) {
					return false;
				}

				let contents = grunt.file.read(filepath);

				// replacement
				contents = contents.replace(/\\/g, '\\\\')
					.replace(/'/g, "\\'")
					.replace(/\r?\n|\r|\t/g, '');

				// process template into output
				let output = grunt.template.process(template, {
					data: {
						css: contents,
						path: filepath
					}
				});

				// replace multiple spaces with single space
				output = output.replace(/  +/g, ' ');

				// gets extension from string with '.' at the start
				let fullExtension = '.' + filepath.split(".").splice(1).join('.');
				let filename = filepath.slice(filepath.lastIndexOf('/') + 1);

				// new filename with desired extension
				let newFilePath = filepath.replace(fullExtension, fullExtension + options.ext);

				// write to destination
				grunt.file.write(newFilePath, output, {
					encoding: 'utf-8'
				});

				// if file is not specified in exclusion array then delete it
				if ( options.deleteFilesExcept.indexOf(filename) < 0) {
					grunt.file.delete(filepath);
				}
			});
		});

	});

};
