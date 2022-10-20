import Component from '@glimmer/component';

interface RowNoResultsArgs {
    columns: any[];
    noResultsText: string;
}
export default class RowNoResultsComponent extends Component<RowNoResultsArgs> {
    cellClassNames: string = 'p-4 text-muted';

    get colspan() {
        return this.args.columns.length;
    }
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'Row::NoResults': typeof RowNoResultsComponent;
    }
}
