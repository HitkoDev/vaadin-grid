var argv = require('yargs').argv;

module.exports = {
  testTimeout: 180 * 1000,
  registerHooks: function (context) {
    var saucelabsPlatforms = [
      // TODO: Excluded iOS tests from the hybrid version. Re-enable for P2 version.
      // 'OS X 10.12/iphone@10.2',
      // 'OS X 10.12/ipad@10.2',
      'Windows 10/microsoftedge@14',
      'Windows 10/internet explorer@11',
      'OS X 10.12/safari@10.0'
    ];

    var cronPlatforms = [
      'Windows 10/chrome@55',
      'Windows 10/firefox@50'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms.concat(cronPlatforms);

    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;

      // Add coverage for local tests only
    } else {
      context.options.plugins.istanbul = {
        'dir': './coverage',
        'reporters': ['text-summary', 'lcov'],
        'include': [
          '/iron-list-behavior.js',
          '/vaadin-grid-active-item-behavior.js',
          '/vaadin-grid-array-data-provider-behavior.js',
          '/vaadin-grid-cell-click-behavior.js',
          '/vaadin-grid-column.js',
          '/vaadin-grid-data-provider-behavior.js',
          '/vaadin-grid-dynamic-columns-behavior.js',
          // TODO: @limonte, revisit this in future, currently a weird istanbul bug here
          // '/vaadin-grid-filter-behavior.js',
          '/vaadin-grid-focusable-cell-container-behavior.js',
          '/vaadin-grid-keyboard-navigation-behavior.js',
          '/vaadin-grid-row-details-behavior.js',
          '/vaadin-grid-selection-behavior.js',
          '/vaadin-grid-selection-column.js',
          '/vaadin-grid-sizer.js',
          // TODO: @limonte, revisit this in future, currently a weird istanbul bug here
          // '/vaadin-grid-sort-behavior.js',
          '/vaadin-grid-table-cell.js',
          '/vaadin-grid-table-focus-trap.js',
          '/vaadin-grid-table-header-footer.js',
          '/vaadin-grid-table-outer-scroller.js',
          '/vaadin-grid-table-row.js',
          '/vaadin-grid-table-scroll-behavior.js',
          '/vaadin-grid-table.js',
          '/vaadin-grid-templatizer.js',
          '/vaadin-grid.js'
        ],
        'exclude': []
      };
    }
  },

  plugins: {
    'random-output': true
  }
};
