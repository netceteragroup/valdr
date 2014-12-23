'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    language: grunt.option('lang') || 'en',

    meta: {
      banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
      ' * License: <%= pkg.license %>\n */\n'
    },

    build_dir: 'dist',

    files: {

      core: [
        'src/valdr.js',
        'src/core/valdrUtil-service.js',
        'src/core/validators/requiredValidator.js',
        'src/core/validators/minValidator.js',
        'src/core/validators/maxValidator.js',
        'src/core/validators/sizeValidator.js',
        'src/core/validators/emailValidator.js',
        'src/core/validators/urlValidator.js',
        'src/core/validators/digitsValidator.js',
        'src/core/validators/futureAndPastSharedValidator.js',
        'src/core/validators/pastValidator.js',
        'src/core/validators/futureValidator.js',
        'src/core/validators/patternValidator.js',
        'src/core/validators/minLengthValidator.js',
        'src/core/validators/maxLengthValidator.js',
        'src/core/validators/hibernateEmailValidator.js',
        'src/core/valdr-service.js',
        'src/core/valdrFormGroup-directive.js',
        'src/core/valdrType-directive.js',
        'src/core/valdrFormItem-directive.js',
        'src/core/valdrEnabled-directive.js'
      ],

      message: [
        'src/message/valdrMessage-service.js',
        'src/message/valdrMessage-directive.js'
      ],

      test: ['src/**/*.spec.js']
    },

    jshint: {

      options: {
        jshintrc: true
      },

      all: ['Gruntfile.js', '<%= files.core %>', '<%= files.message %>', '<%= files.test %>'],

      test: {
        files: {
          src: ['<%= files.test %>']
        }
      }
    },

    concat: {

      banner: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: '<%= concat.core.dest %>',
        dest: '<%= concat.core.dest %>'
      },

      core: {
        src: ['js.prefix', '<%= files.core %>', 'js.suffix'],
        dest: '<%= build_dir %>/valdr.js'
      },

      message: {
        src: ['js.prefix', '<%= files.message %>', 'js.suffix'],
        dest: '<%= build_dir %>/valdr-message.js'
      }

    },

    uglify: {
      core: {
        files: {
          '<%= build_dir %>/valdr.min.js': '<%= concat.core.dest %>'
        }
      },
      message: {
        files: {
          '<%= build_dir %>/valdr-message.min.js': '<%= concat.message.dest %>'
        }
      }
    },

    karma: {
      'unit': {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },

      'chrome-unit': {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Chrome']
      },

      'firefox-unit': {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Firefox']
      }
    },

    copy: {

      demo: {
        files: [{
          src: '*.js',
          dest: 'demo/js/',
          cwd: 'dist/',
          expand: true
        }]
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: ['src/**/*.js'],
        tasks: ['concat:core', 'concat:message', 'concat:banner', 'uglify:core', 'uglify:message', 'copy:demo']
      }
    },

    express: {
      server: {
        options: {
          port: 3005,
          bases: '.',
          server: __dirname + '/server.js'
        }
      }
    }
  });

  grunt.registerTask('test', ['jshint:all', 'karma:unit']);
  grunt.registerTask('default', ['test']);

  // Advanced test tasks
  grunt.registerTask('test-chrome', ['karma:chrome-unit']);
  grunt.registerTask('test-firefox', ['karma:firefox-unit']);
  grunt.registerTask('test-all', ['karma']);

  grunt.registerTask('build', [
    'jshint:all',
    'karma:unit',
    'concat:core',
    'concat:message',
    'concat:banner',
    'uglify:core',
    'uglify:message'
  ]);

  // For development purpose.
  grunt.registerTask('dev', [
    'build',
    'copy:demo',
    'watch:livereload'
  ]);
  grunt.registerTask('server', [
    'express',
    'express-keepalive'
  ]);
};
