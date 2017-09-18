const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="vaadin-grid-active-item-themability-styles">
  <template>
    <style>
      vaadin-grid-table .vaadin-grid-row[active] .vaadin-grid-cell:not([detailscell]) ::slotted(vaadin-grid-cell-content) {
        @apply(--vaadin-grid-body-row-active-cell);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
window.vaadin = window.vaadin || {};
vaadin.elements = vaadin.elements || {};
vaadin.elements.grid = vaadin.elements.grid || {};

/**
 * @polymerBehavior vaadin.elements.grid.ActiveItemBehavior
 */
vaadin.elements.grid.ActiveItemBehavior = {

  properties: {
    /*
     * The item user has last interacted with. Turns to `null` after user deactivates
     * the item by re-interacting with the currently active item.
     */
    activeItem: {
      type: Object,
      notify: true,
      value: null
    }
  },

  listeners: {
    'cell-activate': '_activateItem'
  },

  observers: [
    '_activeItemChanged(activeItem)'
  ],

  _activateItem: function(e) {
    var clickedItem = e.detail.model.item;

    this.activeItem = this.activeItem !== clickedItem ? clickedItem : null;

    e.stopImmediatePropagation();
  },

  _activeItemChanged: function() {
    if (this.$.scroller._physicalItems) {
      this.$.scroller._physicalItems.forEach(function(row) {
        this._updateItem(row, row.item);
      }.bind(this));
    }
  }
};
