$(function() {
  var $searchEl = $('#search'),
      $apiLists = $('.sidebar-secondary'),
      $apiEntries = $('.sidebar-secondary li'),
      $headings = $('.sidebar-primary > li');

  $searchEl.keyup(updateSearch)
  
  function updateSearch() {
    var value = $searchEl.val().replace(/(^\s+|\s+$)/g, '').toLowerCase();
    if (value) {
      if (state === 'notSearching') {
        stateChangeCallbacks.searching();
      }
      $apiEntries.hide();
      // show all entries that match
      var foundIds = [];
      for (var title in autoCompleteData) {
        var id = autoCompleteData[title];
        if (title.toLowerCase().search(value) !== -1) {
          foundIds.push(id);
          $apiEntries.find('a[href="#' + id + '"]').parent().show();
        }
      }

      $headings.show();
      // hide titles that are not visible
      $headings.each(function() {
        var $this = $(this);
        if (!$this.find('> ul > li:visible').length) {
          $this.hide();
        }
      });

      // scroll to the found item if there was just one
      if (foundIds.length === 1) {
        window.scrollTo(0, $('#' + foundIds[0]).offset().top);
      }
    } else {
      if (state === 'searching') {
        stateChangeCallbacks.notSearching();
      }
    }
  }
  
  var state;
  var stateChangeCallbacks = {
    searching: function() {
      state = 'searching';
      $apiLists.show();
    },
    notSearching: function() {
      state = 'notSearching';
      $headings.show();
      $apiLists.hide();
    }
  };
  
  stateChangeCallbacks.notSearching();

});
