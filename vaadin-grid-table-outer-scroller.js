import '../polymer/polymer.js';
import { Polymer } from '../polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        box-sizing: border-box;
        overflow: auto;
      }

      :host([passthrough]) {
        pointer-events: none;
      }

      :host([ios]) {
        pointer-events: all;
        z-index: -3;
      }

      :host([ios][scrolling]) {
        z-index: 0;
      }
    </style>

    <slot></slot>
`,

  is: 'vaadin-grid-table-outer-scroller',

  properties: {
    scrollTarget: {
      type: Object,
      observer: '_scrollTargetChanged'
    },

    passthrough: {
      type: Boolean,
      reflectToAttribute: true,
      value: true
    }
  },

  listeners: {
    'scroll': '_syncScrollTarget'
  },

  attached: function() {
    this.listen(this.domHost, 'mousemove', '_onMouseMove');

    // for some reason scroll bars are hidden in iOS if this style is
    // added in stylesheets or before attaching.
    this.style.webkitOverflowScrolling = 'touch';
  },

  detached: function() {
    this.unlisten(this.domHost, 'mousemove', '_onMouseMove');
  },

  _scrollTargetChanged: function(scrollTarget, oldScrollTarget) {
    if (oldScrollTarget) {
      this.unlisten(oldScrollTarget, 'scroll', '_syncOuterScroller');
    }
    this.listen(scrollTarget, 'scroll', '_syncOuterScroller');
  },

  _onMouseMove: function(e) {
    this.passthrough = e.offsetY <= this.clientHeight && e.offsetX <= this.clientWidth;
  },

  _syncOuterScroller: function() {
    if (!this._syncingScrollTarget) {
      this._syncingOuterScroller = true;
      this.scrollTop = this.domHost._scrollTop;
      this.scrollLeft = this.domHost._scrollLeft;
    }
    this._syncingScrollTarget = false;
  },

  _syncScrollTarget: function() {
    if (!this._syncingOuterScroller) {
      this._syncingScrollTarget = true;
      this.scrollTarget.scrollTop = this.scrollTop;
      this.scrollTarget.scrollLeft = this.scrollLeft;
      this.domHost._scrollHandler();
    }
    this._syncingOuterScroller = false;
  }
});
