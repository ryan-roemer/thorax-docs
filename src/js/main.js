(function(){

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

})();