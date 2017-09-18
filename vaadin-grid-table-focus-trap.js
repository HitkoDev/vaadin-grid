import '../@polymer/polymer.js';
import { Polymer } from '../@polymer/lib/legacy/polymer-fn.js';
import { dom } from '../@polymer/lib/legacy/polymer.dom.js';
import { Settings } from '../@polymer/lib/utils/settings.js';
Polymer({
  _template: `
    <style>
     :host {
       position: absolute;
       z-index: -3;
       height: 0;
       overflow: hidden;
     }

     :host(:focus),
     .primary:focus,
     ::slotted(.primary:focus),
     .secondary:focus,
     ::slotted(.secondary:focus) {
       outline: none;
     }
    </style>

    <!-- trap needs to have content in order for Safari to scroll the page when focused -->
    <div class="primary" tabindex="0" role="gridcell" on-focus="_onBaitFocus" on-blur="_onBaitBlur"><div aria-hidden="true">&nbsp;</div></div>
    <div class="secondary" tabindex="-1" role="gridcell" on-focus="_onBaitFocus" on-blur="_onBaitBlur"><div aria-hidden="true">&nbsp;</div></div>

    <slot></slot>
`,

  is: 'vaadin-grid-table-focus-trap',

  hostAttributes: {
    'role': 'gridcell' // gridcell roles are for VoiceOver to announce "you're in a cell"
  },

  properties: {
    activeTarget: {
      type: String,
      observer: '_activeTargetChanged'
    },
  },

  ready: function() {
    this._primary = dom(this.root).querySelector('.primary');
    this._secondary = dom(this.root).querySelector('.secondary');

    // In native shadow, focus traps need to be inside the same scope as
    // the "labelled by" elements
    if (Settings.useNativeShadow || Settings.useShadow) {
      dom(this).appendChild(this._secondary);
      dom(this).appendChild(this._primary);
    }
  },

  // TODO: native 'focus' and 'blur' events get retargeted differently in v0 and v1 polyfills
  // so it's easier to avoid using them across shadow roots.
  focus: function(e) {
    if (this._focused !== this._primary) {
      this._primary.focus();
    } else {
      this._secondary.focus();
    }
  },

  _onBaitFocus: function(e) {
    this._focused = e.target;
    if (!this._movingFocusInternally) {
      // TODO: native 'focus' and 'blur' events get retargeted differently in v0 and v1 polyfills
      // so it's easier to fire own custom events in this case.
      this.fire('focus-gained');
      this._primary.tabIndex = -1; // remove from taborder to prevent unexpected tab loop in native shadow.
    }
  },

  _onBaitBlur: function(e) {
    if (!this._movingFocusInternally) {
      this.fire('focus-lost');
      this._primary.tabIndex = 0; // put back into taborder to enable shift-tabbing in.
    }
  },

  _activeTargetChanged: function(target) {
    // moving focus seems to be the most reliable way to get different screenreaders
    // to announce the "aria-labelledby" property
    this._movingFocusInternally = true;
    if (this._focused === this._primary) {
      this._secondary.setAttribute('aria-labelledby', target);
      this._secondary.focus();
    } else {
      this._primary.setAttribute('aria-labelledby', target);
      this._primary.focus();
    }
    this._movingFocusInternally = false;
  },

  _reannounce: function() {
    this._movingFocusInternally = true;
    if (this._focused === this._primary) {
      this._secondary.setAttribute('aria-labelledby', this.activeTarget);
      this._secondary.focus();
    } else {
      this._primary.setAttribute('aria-labelledby', this.activeTarget);
      this._primary.focus();
    }
    this._movingFocusInternally = false;
  }
});
