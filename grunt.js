/*global module:false*/
module.exports = function(grunt) {

  grunt.file.copy('../thorax/README.md', './src/api.md');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Thorax - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Thorax; Licensed MIT */'
    },
    lint: {
      files: ['js/main.js']
    },
    static: {
      require: 'helpers.js',
      build: {
        'public/index.html': 'src/index.hbs.html',
        'public/api.html': [
          'src/includes/api-header.hbs.html',
          'src/api.md',
          'src/includes/api-footer.html'
        ]
      }
    },
    concat: {
      dist: {
        src: ['src/js/*.js'],
        dest: 'public/js/compiled/site.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'public/js/compiled/site.min.js'
      }
    },
    watch: {
      files: ['<config:lint.files>', 'src/css/scss/*.scss', 'src/*.hbs.html', 'includes/*'],
      tasks: 'static compass:build lint concat min reload'
    },
    compass: {
      build: {
        src: 'src/scss',
        dest: 'public/css',
        outputstyle: 'compressed',
        linecomments: false,
        forcecompile: true
      }
    },
    reload: {
      port: 35729,
      liveReload: {},
      proxy: {
        host: 'localhost',
        port: 8000
      },
    },
    server: {
      base: './public'
    },
    img: {
      png: {
        src: ['public/img/*.png']
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true
      },
      globals: {
        jQuery: true,
        $: true,
        _: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'static build server open-browser reload watch');
  grunt.registerTask('build', 'compass lint concat min img');
  grunt.registerTask('open-browser', function() {
    var open = require('open');
    open( 'http://localhost:8000' );
  });

  // Extra Tasks

  grunt.loadTasks('grunt');

};