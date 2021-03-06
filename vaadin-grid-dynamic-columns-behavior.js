import { dom } from '../@polymer/polymer/lib/legacy/polymer.dom.js';
import { Settings } from '../@polymer/polymer/lib/utils/settings.js';
import { Element } from '../@polymer/polymer/polymer-element.js';
import { Polymer } from '../@polymer/polymer/lib/legacy/polymer-fn.js';
window.vaadin = window.vaadin || {};
vaadin.elements = vaadin.elements || {};
vaadin.elements.grid = vaadin.elements.grid || {};

/**
 * @polymerBehavior vaadin.elements.grid.DynamicColumnsBehavior
 */
vaadin.elements.grid.DynamicColumnsBehavior = {
  ready: function() {
    this._addNodeObserver();
  },

  _hasColumnGroups: function(columns) {
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].localName === 'vaadin-grid-column-group') {
        return true;
      }
    }

    return false;
  },

  _getChildColumns: function(el) {
    return dom(el).queryDistributedElements(
        'vaadin-grid-column, vaadin-grid-column-group, vaadin-grid-selection-column'
    );
  },

  _flattenColumnGroups: function(columns) {
    return columns.map(function(col) {
      if (col.localName === 'vaadin-grid-column-group') {
        return this._getChildColumns(col);
      } else {
        return [col];
      }
    }, this).reduce(function(prev, curr) {
      return prev.concat(curr);
    }, []);
  },

  _getColumnTree: function() {
    var rootColumns = this.queryAllEffectiveChildren(
      'vaadin-grid-column, vaadin-grid-column-group, vaadin-grid-selection-column');

    var _columnTree = [];

    for (var c = rootColumns; ; ) {
      _columnTree.push(c);
      if (!this._hasColumnGroups(c)) {
        break;
      }
      c = this._flattenColumnGroups(c);
    }

    return _columnTree;
  },

  _updateColumnTree: function() {
    var columnTree = this._getColumnTree();
    if (!this._arrayEquals(columnTree, this._columnTree)) {
      this._columnTree = columnTree;
    }
  },

  _addNodeObserver: function() {
    this._observer = dom(this).observeNodes(function(info) {
      var isColumnElement = function(node) {
        return (node.nodeType === Node.ELEMENT_NODE && /^vaadin-grid-(column|selection)/i.test(node.localName));
      };
      if (info.addedNodes.filter(isColumnElement).length > 0 ||
        info.removedNodes.filter(isColumnElement).length > 0) {
        this._updateColumnTree();
      }

      // in native Shadow, tab order goes first through shadow root, then moves over
      // to light children. We need to make sure footer focus trap is always
      // the very last element that can be tabbed into.
      if (Settings.useNativeShadow || Settings.useShadow) {
        dom(this).appendChild(this.$.footerFocusTrap);
      }

      this.debounce('check-imports', this._checkImports, 2000);
    }.bind(this));
  },

  _arrayEquals: function(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length != arr2.length) {
      return false;
    }

    for (var i = 0, l = arr1.length; i < l; i++) {
      // Check if we have nested arrays
      if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this._arrayEquals(arr1[i], arr2[i])) {
          return false;
        }
      } else if (arr1[i] != arr2[i]) {
        return false;
      }
    }
    return true;
  },

  _checkImports: function() {
    [
      'vaadin-grid-column-group',
      'vaadin-grid-sorter',
      'vaadin-grid-filter',
      'vaadin-grid-selection-column'
    ].forEach(function(elementName) {
      var element = dom(this).querySelector(elementName);
      if (element && (Polymer.isInstance ? !Polymer.isInstance(element) : !(element instanceof Element))) {
        console.warn('Make sure you have imported the required module for <' + elementName + '> element.');
      }
    }, this);
  }
};
