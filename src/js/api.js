$(function() {
  var $searchEl = $('#search'),
      $apiLists = $('.sidebar-secondary'),
      $apiEntries = $('.sidebar-secondary li'),
      $headings = $('.sidebar-primary > li'),
      $searchReset = $('#search-reset');

  $searchEl.keyup(updateSearch);

  $searchReset.click(function() {
    $searchEl.val('');
    stateChangeCallbacks.notSearching();
  });
  
  function updateSearch() {
    var value = $searchEl.val().replace(/(^\s+|\s+$)/g, '').toLowerCase();
    if (value) {
      if (state === 'notSearching') {
        stateChangeCallbacks.searching();
      }
      $apiEntries.hide();
      // show all entries that match
      var foundIds = [],
          foundTitles = [];
      for (var title in autoCompleteData) {
        var id = autoCompleteData[title];
        if (title.toLowerCase().search(value) !== -1) {
          foundIds.push(id);
          foundTitles.push(title);
        }
      }

      // show API entries
      for (var i = 0; i < foundIds.length; ++i) {
        var id = foundIds[i];
        $apiLists.find('a[href="#' + id + '"]').parent().show();
      }

      // hide titles that have no API entries
      $headings.show();
      $headings.each(function() {
        var $this = $(this);
        if (!$this.find('> ul > li:visible').length) {
          $this.hide();
        }
      });

      // show titles that directly match
      for (var i = 0; i < foundIds.length; ++i) {
        var id = foundIds[i];
        $headings.find('> a[href="#' + id + '"]').parent().show();
      }

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
      $searchReset.show();
    },
    notSearching: function() {
      state = 'notSearching';
      $headings.show();
      $apiLists.hide();
      $searchReset.hide();
    }
  };
  
  stateChangeCallbacks.notSearching();

});
