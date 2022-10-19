import Component from '@glimmer/component';

interface RowLoadingArgs {
    columns: any[];
}
export default class RowLoadingComponent extends Component<RowLoadingArgs> {
    cellClassNames: string = 'p-4';

    get colspan() {
        return this.args.columns.length;
    }
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'Row::Loading': typeof RowLoadingComponent;
    }
}
