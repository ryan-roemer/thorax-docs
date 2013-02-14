Controlling Context
===================

Add note about doing "explicit context" with:

    _getContext: function() {
      return getValue(this, 'context');
    }

meaning "this" won't ever get merged into the context.