import { _ as _defineProperty } from '../../../defineProperty-f419f636.js';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';

var TEMPLATE = hbs("<tr class=\"et-tr data-table-row-loading\">\n    <td class={{this.cellClassNames}} colspan={{this.colspan}}>\n        <ProgressSpinner />\n    </td>\n</tr>");

class RowLoadingComponent extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "cellClassNames", 'p-4');
  }

  get colspan() {
    return this.args.columns.length;
  }

}
setComponentTemplate(TEMPLATE, RowLoadingComponent);

export { RowLoadingComponent as default };
