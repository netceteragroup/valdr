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
        'src/model-validation.js',
        'src/core/demo-controller.js'
      ],

      test: ['src/**/*.spec.js']
    },

    jshint: {

      options: {
        jshintrc: true
      },

      all: ['Gruntfile.js', '<%= files.core %>', '<%= files.test %>'],

      core: {
        files: {
          src: ['<%= files.core %>']
        }
      },

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
        dest: '<%= build_dir %>/angular-model-validation.js'
      }

    },

    uglify: {
      core: {
        files: {
          '<%= build_dir %>/angular-model-validation.min.js': '<%= concat.core.dest %>'
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
        tasks: ['concat:core', 'concat:banner', 'uglify:core', 'copy:demo']
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

  grunt.registerTask('default', ['jshint:all', 'karma:unit']);
  grunt.registerTask('test', ['karma:unit']);

  // Advanced test tasks
  grunt.registerTask('test-chrome', ['karma:chrome-unit']);
  grunt.registerTask('test-firefox', ['karma:firefox-unit']);
  grunt.registerTask('test-all', ['karma']);

  grunt.registerTask('build', [
    'jshint:all',
    'karma:unit',
    'concat:core',
    'concat:banner',
    'uglify:core'
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
