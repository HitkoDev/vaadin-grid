import { dom } from '../@polymer/polymer/lib/legacy/polymer.dom.js';
window.vaadin = window.vaadin || {};
vaadin.elements = vaadin.elements || {};
vaadin.elements.grid = vaadin.elements.grid || {};

/**
 * @polymerBehavior vaadin.elements.grid.CellClickBehavior
 */
vaadin.elements.grid.CellClickBehavior = {

  listeners: {
    'click': '_onClick'
  },

  attached: function() {
    this._cellContentFocusHandler = function(e) {
      // IE11 fires `focus` events for the cell content element even when nothing
      // focusable was clicked.
      if (e.target !== this._cellContent) {
        this.fire('cell-content-focus', {cell: this});
      }
    }.bind(this);

    // we need to capture focus events originating from elements inside this cell,
    // capture mode seems to be required in order it to work.
    this.addEventListener('focus', this._cellContentFocusHandler, true);
  },

  detached: function() {
    this.removeEventListener('focus', this._cellContentFocusHandler, true);
  },

  // we need to listen to click instead of tap because on mobile safari, the
  // document.activeElement has not been updated (focus has not been shifted)
  // yet at the point when tap event is being executed.
  _onClick: function(e) {
    // this event is only supposed to be fired from cells.
    if (this.localName !== 'vaadin-grid-sorter') {
      this.fire('cell-focus', {cell: this});
    }

    // Prevent item action if cell itself is not focused.
    if (this._cellClick) {
      var target = dom(e).localTarget;
      // Polymer.dom(e).localTarget usually returns <content> element in shady
      // DOM. We'll get and use the cell-content wrapper in that case.
      if (target.getDistributedNodes) {
        target = dom(target).getDistributedNodes()[0];
      }

      var path = dom(e).path;
      var elementsClicked = Array.prototype.slice.call(path, 0, path.indexOf(target) + 1);
      if (!target.contains(this.target && this.target.root.activeElement || document.activeElement) &&
          !elementsClicked.some(this._isFocusable)) {
        this._cellClick(e);
      }
    }
  },

  _isFocusable: function(target) {
    var parent = dom(target).parentNode;
    var isFocusableElement = Array.prototype.indexOf.call(dom(parent)
    .querySelectorAll('[tabindex], button, input, select, textarea, object, iframe, label, a[href], area[href]'), target) !== -1;
    return !target.disabled && isFocusableElement;
  }
};
