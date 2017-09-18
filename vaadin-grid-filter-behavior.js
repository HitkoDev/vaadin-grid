window.vaadin = window.vaadin || {};
vaadin.elements = vaadin.elements || {};
vaadin.elements.grid = vaadin.elements.grid || {};

/**
 * @polymerBehavior vaadin.elements.grid.FilterBehavior
 */
vaadin.elements.grid.FilterBehavior = {
  properties: {

    _filters: {
      type: Array,
      value: function() {
        return [];
      }
    }

  },

  listeners: {
    'filter-changed': '_filterChanged'
  },

  _filterChanged: function(e) {
    if (this._filters.indexOf(e.target) === -1) {
      this._filters.push(e.target);
    }

    e.stopPropagation();

    if (this.dataProvider) {
      this.clearCache();
    }
  },

  _mapFilters: function() {
    return this._filters.map(function(filter) {
      return {
        path: filter.path,
        value: filter.value
      };
    });
  },
};
