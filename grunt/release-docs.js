var path = require('path'),
    execSeries = require('../lib/exec-series.js');

module.exports = function(grunt) {
  grunt.registerTask('release-docs', function() {
    var done = this.async();
    execSeries([
      ['rm', ['-rf', './thorax-gh-pages']],
      ['git', ['clone', 'git@github.com:walmartlabs/thorax.git', 'thorax-gh-pages']],
    ], function() {
      execSeries([
        ['git', ['checkout', 'gh-pages']],
        ['cp', ['-a', '../public/.', '../thorax-gh-pages/']],
        ['git', ['add', '-A', '.']],
        ['git', ['commit', '-m', '"update docs"']],
        ['git', ['push', 'origin', 'gh-pages']],
        ['rm', ['-rf', '../thorax-gh-pages']]
      ], done, {
        cwd: path.join(__dirname, '..', 'thorax-gh-pages')
      });
    }, {
      cwd: path.join(__dirname, '..')
    });
  });
};