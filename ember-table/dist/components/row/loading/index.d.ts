import Component from '@glimmer/component';
interface RowLoadingArgs {
    columns: any[];
}
declare class RowLoadingComponent extends Component<RowLoadingArgs> {
    cellClassNames: string;
    get colspan(): number;
}
export { RowLoadingComponent as default };
