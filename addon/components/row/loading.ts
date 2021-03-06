import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
// @ts-ignore: Ignore import of compiled template
import layout from '@gavant/ember-table/templates/components/row/loading';

export default class RowLoadingComponent extends Component {
    layout = layout;
    tagName: string = 'tr';
    classNames: string[] = ['et-tr', 'data-table-row-loading'];
    cellClassNames: string = 'p-4';

    //readonly attributes

    @readOnly('columns.length') colspan!: number;
}
