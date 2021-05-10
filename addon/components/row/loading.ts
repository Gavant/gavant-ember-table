import Component from '@glimmer/component';

interface RowLoadingArgs {
    columns: any[];
}
export default class RowLoadingComponent extends Component<RowLoadingArgs> {
    tagName: string = 'tr';
    classNames: string[] = ['et-tr', 'data-table-row-loading'];
    cellClassNames: string = 'p-4';

    get colspan() {
        return this.args.columns.length;
    }
}
