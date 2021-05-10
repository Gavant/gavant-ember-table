import Component from '@glimmer/component';

interface RowNoResultsArgs {
    columns: any[];
}
export default class RowNoResultsComponent extends Component<RowNoResultsArgs> {
    tagName: string = 'tr';
    classNames: string[] = ['et-tr', 'data-table-row-no-results'];
    cellClassNames: string = 'p-4 text-muted';

    //readonly attributes

    get colspan() {
        return this.args.columns.length;
    }
}
