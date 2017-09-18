import '../../iron-demo-helpers/demo-snippet.js';
import '../../iron-flex-layout/iron-flex-layout-classes.js';
import '../../paper-styles/default-theme.js';
import '../../elements-demo-resources/common.js';
import '../../elements-demo-resources/demo-navigation.js';
import '../vaadin-grid.js';
import './x-data-provider.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<custom-style>
  <style is="custom-style" include="iron-flex iron-flex-alignment"></style>
</custom-style><style>
  vaadin-grid {
    text-transform: capitalize;
  }

  h3 + p {
    margin-top: 0;
  }
</style>`;

document.head.appendChild($_documentContainer);
window.demos = [
  {name: 'index', title: 'Basic Usage'},
  {name: 'data', title: 'Assigning Data'},
  {name: 'selection'},
  {name: 'columns', title: 'Columns'},
  {name: 'sorting-filtering', title: 'Sorting and Filtering'},
  {name: 'row-details', title: 'Row Details'},
  {name: 'crud'},
  {name: 'pagination'},
  {name: 'styling-material', title: 'Styling: Material Design'},
  {name: 'styling-valo', title: 'Styling: Valo'},
  {name: 'styling-transparent', title: 'Styling: Transparent Header'},
  {name: 'styling-rounded', title: 'Styling: Rounded Rows'},

];
