(function(){

  var sidebar = $('.sidebar');
  var sidebarTop = sidebar.offset().top;
  var threshold = 24;

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

})();
