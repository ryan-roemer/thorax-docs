/*global module:false*/
module.exports = function(grunt) {

  grunt.file.copy('../thorax/README.md', './src/api.md');
  grunt.file.copy('./src/js/vendor/jquery-1.8.2.min.js', './public/js/vendor/jquery-1.8.2.min.js');
  grunt.file.copy('./src/js/vendor/modernizr-2.6.2.min.js', './public/js/vendor/modernizr-2.6.2.min.js');

  // Project configuration.
  grunt.initConfig({
    copy: {
      main: {
        files: [
          {
            src: ["*"],
            dest: "./public/img/",
            cwd: "./src/img/",
            expand: true
          }
        ]
      }
    },
    meta: {
      version: '0.1.0',
      banner: '/*! Thorax - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Thorax; Licensed MIT */'
    },
    static: {
      docs: {
        require: 'helpers.js',
        build: (function() {
          var staticBuild = {
            'public/index.html': 'src/index.hbs.html',
            'public/api.html': [
              'src/includes/api-header.hbs.html',
              'src/api.md',
              'src/includes/api-footer.html'
            ],
            'public/tutorials.html': 'src/tutorials.hbs.html'
          };
          require('fs').readdirSync('src/tutorials').forEach(function(tutorial) {
            staticBuild['public/tutorials/' + tutorial.replace(/\.md$/, '.html')] = [
              {
                file: 'src/includes/tutorials-header.hbs.html',
                context: {
                  name: tutorial.replace(/\.md$/, '')
                }
              },
              'src/tutorials/' + tutorial,
              'src/includes/tutorials-footer.html'
            ];
          });
          return staticBuild;
        })()
      }
    },
    concat: {
      dist: {
        src: ['src/js/*.js'],
        dest: 'public/js/compiled/site.js'
      }
    },
    watch: {
      files: ['src/css/scss/*.scss', 'src/*.hbs.html', 'src/includes/*'],
      tasks: 'static:docs compass:build concat'
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
    connect: {
      server: {
        options: {
          port: 8000,
          base: './public'
        }
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
    }
  });

  // Default task.
  grunt.registerTask('default', ['copy:main','static:docs','build','connect:server','open-browser','watch']);
  grunt.registerTask('build', ['compass','concat']);

  grunt.registerTask('open-browser', function() {
    var open = require('open');
    open( 'http://localhost:8000' );
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('static');

  // Extra Tasks

  grunt.loadTasks('grunt');

};
