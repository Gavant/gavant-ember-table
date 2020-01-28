import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
// @ts-ignore: Ignore import of compiled template
import layout from '@gavant/ember-table/templates/components/row/no-results';

export default class RowNoResultsComponent extends Component {
    layout = layout;
    tagName: string = 'tr';
    classNames: string[] = ['et-tr', 'data-table-row-no-results'];
    cellClassNames: string = 'p-4 text-muted';

    //readonly attributes

    @readOnly('columns.length') colspan?: number;
}
