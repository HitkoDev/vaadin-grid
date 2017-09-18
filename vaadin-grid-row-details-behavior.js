import './vaadin-grid-templatizer.js';
import { dom } from '../polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="vaadin-grid-row-details-styles">
  <template>
    <style>
      [detailscell] {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    </style>
  </template>
</dom-module><dom-module id="vaadin-grid-row-details-themability-styles">
  <template>
    <style>
      .vaadin-grid-cell[detailscell] ::slotted(vaadin-grid-cell-content) {
        background: #fff;
        @apply(--vaadin-grid-body-row-details-cell);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
window.vaadin = window.vaadin || {};
vaadin.elements = vaadin.elements || {};
vaadin.elements.grid = vaadin.elements.grid || {};

/**
 * @polymerBehavior vaadin.elements.grid.RowDetailsBehavior
 */
vaadin.elements.grid.RowDetailsBehavior = {

  properties: {

    /**
     * An array containing references to expanded items.
     */
    expandedItems: {
      type: Array,
      value: function() {
        return [];
      }
    }
  },

  listeners: {
    'template-instance-changed': '_templateInstanceChangedExpanded'
  },

  observers: [
    '_expandedItemsChanged(expandedItems.*, dataProvider)',
    '_rowDetailsTemplateChanged(_rowDetailsTemplate)'
  ],

  _expandedItemsChanged: function(expandedItems, dataProvider) {
    if (expandedItems === undefined || dataProvider === undefined) {
      return;
    }

    this._flushItemsDebouncer();
    if (this.$.scroller._physicalItems) {
      this.$.scroller._physicalItems.forEach(function(row) {
        row.expanded = this._isExpanded(row.item);
      }.bind(this));
    }
  },

  _rowDetailsTemplateChanged: function(rowDetailsTemplate) {
    var templatizer = new vaadin.elements.grid.Templatizer();
    templatizer.dataHost = this.dataHost;
    templatizer._instanceProps = {
      expanded: true,
      index: true,
      item: true,
      selected: true
    };

    // row details templatizer needs to be attached so that `item-changed` and
    // `template-instance-changed` events propagate to grid.
    dom(this.root).appendChild(templatizer);

    templatizer.template = rowDetailsTemplate;
    rowDetailsTemplate.templatizer = templatizer;
  },

  _isExpanded: function(item) {
    return this.expandedItems && this.expandedItems.indexOf(item) !== -1;
  },

  /**
   * Expand the details row of a given item.
   */
  expandItem: function(item) {
    if (!this._isExpanded(item)) {
      this.push('expandedItems', item);
    }
  },

  /**
   * Collapse the details row of a given item.
   */
  collapseItem: function(item) {
    if (this._isExpanded(item)) {
      this.splice('expandedItems', this.expandedItems.indexOf(item), 1);
    }
  },

  _templateInstanceChangedExpanded: function(e) {
    if (e.detail.prop === 'expanded') {
      if (e.detail.value) {
        this.expandItem(e.detail.inst.item);
      } else {
        this.collapseItem(e.detail.inst.item);
      }

      // stop this internal event from propagating outside.
      e.stopPropagation();
    }
  }
};
