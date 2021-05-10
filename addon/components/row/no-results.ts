import Component from '@glimmer/component';

import layout from '@gavant/ember-table/templates/components/row/no-results';

interface RowNoResultsArgs {
    columns: any[];
}
export default class RowNoResultsComponent extends Component<RowNoResultsArgs> {
    layout = layout;
    tagName: string = 'tr';
    classNames: string[] = ['et-tr', 'data-table-row-no-results'];
    cellClassNames: string = 'p-4 text-muted';

    //readonly attributes

    get colspan() {
        return this.args.columns.length;
    }
}
