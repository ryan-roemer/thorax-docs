$(function() {

  // Fix API sidebar position on scroll

  var sidebar = $('.sidebar');
  var threshold = 24;

  if (sidebar.length > 0) {
    var sidebarTop = sidebar.offset().top;

    var positionSidebar = function() {
      var docViewTop = $(window).scrollTop();

      if (sidebarTop <= docViewTop + 24) {
        sidebar.addClass('is-fixed');
      } else {
        sidebar.removeClass('is-fixed');
      }
    };

    $(window).scroll(function() {
      positionSidebar();
    });
  }


  // Toggle tutorial video display

  var hero = $('.hero'),
      videoButton = $('.js-screencast');

  if (hero.length > 0) {
    hero.height( hero.outerHeight() );

    var toggleVideo = function() {
      if ( !hero.hasClass('has-video') && !hero.hasClass('no-video') ) {
        hero.addClass('has-video');
      } else {
        hero.toggleClass('has-video no-video');
      }
    };

    videoButton.on('click', function(e) {
      e.preventDefault();
      toggleVideo();
    });
  }

});