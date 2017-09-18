import '../@polymer/polymer.js';
import { IronResizableBehavior } from '../@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import './vaadin-grid-table.js';
import './vaadin-grid-column.js';
import './vaadin-grid-active-item-behavior.js';
import './vaadin-grid-row-details-behavior.js';
import './vaadin-grid-data-provider-behavior.js';
import './vaadin-grid-array-data-provider-behavior.js';
import './vaadin-grid-dynamic-columns-behavior.js';
import './vaadin-grid-selection-behavior.js';
import './vaadin-grid-sort-behavior.js';
import './vaadin-grid-filter-behavior.js';
import './vaadin-grid-column-reordering-behavior.js';
import { Polymer } from '../@polymer/lib/legacy/polymer-fn.js';
import { IronA11yKeysBehavior } from '../@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import { dom } from '../@polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        height: 400px;
        background: var(--primary-background-color, #fff);
        box-sizing: border-box;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      }

      :host(:focus) {
        -webkit-tap-highlight-color: transparent;
      }

      :host(:focus) {
        outline: none;
      }

      #scroller {
        height: 100%;
        width: 100%;
      }
    </style>

    <style include="vaadin-grid-table-scroll-styles"></style>
    <style include="vaadin-grid-row-details-styles"></style>
    <style include="vaadin-grid-table-styles"></style>

    <style include="vaadin-grid-table-themability-styles"></style>
    <style include="vaadin-grid-selection-themability-styles"></style>
    <style include="vaadin-grid-navigation-themability-styles"></style>
    <style include="vaadin-grid-active-item-themability-styles"></style>
    <style include="vaadin-grid-row-details-themability-styles"></style>
    <style include="vaadin-grid-column-reordering-themability-styles"></style>

    <vaadin-grid-table id="scroller" loading\$="[[_loading]]" bind-data="[[_bindData]]" size="[[size]]" column-tree="[[_columnTree]]" row-details-template="[[_rowDetailsTemplate]]" column-reordering-allowed="[[columnReorderingAllowed]]">
      <vaadin-grid-table-header id="header" slot="header" target="[[_getContentTarget()]]" column-tree="[[_columnTree]]"></vaadin-grid-table-header>
      <vaadin-grid-table-body id="items" slot="items"></vaadin-grid-table-body>
      <vaadin-grid-table-footer id="footer" slot="footer" target="[[_getContentTarget()]]" column-tree="[[_columnTree]]"></vaadin-grid-table-footer>

      <!--
      in native Shadow, we move the footer focus trap to light DOM.
      It needs to be injected/slotted back inside the shadow root in order to be focusable.
     -->
      <slot name="footerFocusTrap"></slot>

      <!-- This is for column elements, to make sure we can listen for events coming from them in Safari 9? -->
      <!-- WARNING: this is converted to <content> without selector in P1 which might cause performance issues together with large number of cell content injection points. -->
      <slot></slot>

      <vaadin-grid-table-focus-trap id="footerFocusTrap" slot="footerFocusTrap" on-focus-gained="_onFooterFocus" on-focus-lost="_onFocusout">
      </vaadin-grid-table-focus-trap>
    </vaadin-grid-table>
`,

  is: 'vaadin-grid',

  properties: {

    _columnTree: {
      type: Array,
      notify: true
    },


    /**
     * Estimated size of the grid data (number of items).
     * When using function data providers, it always needs to be set manually.
     */
    size: Number,

    _rowDetailsTemplate: Object,

    _bindData: {
      type: Object,
      value: function() {
        return this._getItem.bind(this);
      }
    }
  },

  behaviors: [
    IronA11yKeysBehavior,
    IronResizableBehavior,
    vaadin.elements.grid.ActiveItemBehavior,
    vaadin.elements.grid.RowDetailsBehavior,
    vaadin.elements.grid.DataProviderBehavior,
    vaadin.elements.grid.DynamicColumnsBehavior,
    vaadin.elements.grid.ArrayDataProviderBehavior,
    vaadin.elements.grid.SelectionBehavior,
    vaadin.elements.grid.SortBehavior,
    vaadin.elements.grid.FilterBehavior,
    vaadin.elements.grid.ColumnReorderingBehavior,
    vaadin.elements.grid.TableKeyboardBehavior
  ],

  listeners: {
    'property-changed': '_columnPropChanged',
    'iron-resize': '_gridResizeHandler'
  },

  _updateItem: function(row, item) {
    row.style.minHeight = item ? '' : this.$.scroller._physicalAverage + 'px';
    row.item = item;
    row.selected = this._isSelected(item);
    row.expanded = this._isExpanded(item);
    row.active = item !== null && item == this.activeItem;
    row.focused = row.index === this.$.items._focusedRowIndex;
  },

  _getContentTarget: function() {
    return this;
  },

  ready: function() {
    this._updateColumnTree();
    this._rowDetailsTemplate = dom(this).querySelector('template.row-details') || undefined;
    this.$.scroller.target = this;

    if (document.doctype === null) {
      console.warn(
        '<vaadin-grid> requires the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.'
      );
    }
  },

  _columnPropChanged: function(e) {
    if (e.detail.path === '_childColumns') {
      this._updateColumnTree();
    }

    e.stopPropagation();
  },

  _gridResizeHandler: function() {
    this.$.scroller._gridResizeHandler();
  }
});
