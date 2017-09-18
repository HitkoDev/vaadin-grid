import './vaadin-grid-table-cell.js';
import { Polymer } from '../@polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style>
      :host {
        display: flex;
        visibility: hidden;
      }

      .cell {
        display: block;
        flex-shrink: 0;
        line-height: 0;
        font-size: 1px;
        margin-top: -1em;
      }

      .cell[hidden] {
        display: none;
      }
    </style>

    <template is="dom-repeat" items="[[_columns]]" as="column">
      <vaadin-grid-sizer-cell class="cell" column="[[column]]">&nbsp;</vaadin-grid-sizer-cell>
    </template>
`,

  is: 'vaadin-grid-sizer',

  properties: {
    columnTree: Array,

    top: Number,

    _columns: Array
  },

  observers: [
    '_columnTreeChanged(columnTree)',
    '_topChanged(top)'
  ],

  _columnTreeChanged: function(columnTree) {
    this._columns = columnTree[columnTree.length - 1];
  },

  _topChanged: function(top) {
    this.style.top = top + 'px';
  }
});
