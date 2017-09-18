import '../@polymer/polymer.js';
import { Polymer } from '../@polymer/lib/legacy/polymer-fn.js';
import { dom } from '../@polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style>
      :host {
        display: inline-flex;
      }

      #filter {
        width: 100%;
        box-sizing: border-box;
      }
    </style>
    <slot name="filter">
      <input id="filter" value="{{value::input}}">
    </slot>
`,

  is: 'vaadin-grid-filter',

  properties: {

    /**
     * JS Path of the property in the item used for filtering the data.
     */
    path: String,

    /**
     * Current filter value.
     */
    value: {
      type: String,
      notify: true
    }
  },

  observers: ['_filterChanged(path, value, isAttached)'],

  ready: function() {
    var child = dom(this).firstElementChild;
    if (child && child.getAttribute('slot') !== 'filter') {
      console.warn('Make sure you have assigned slot="filter" to the child elements of <vaadin-grid-filter>');
      child.setAttribute('slot', 'filter');
    }
  },

  _filterChanged: function(path, value, isAttached) {
    if (path === undefined || value === undefined || isAttached === undefined) {
      return;
    }
    
    if (isAttached) {
      this.debounce('filter-changed', function() {
        this.fire('filter-changed');
      }, 200);
    }
  }
});
