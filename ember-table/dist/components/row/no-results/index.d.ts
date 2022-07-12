import Component from '@glimmer/component';
interface RowNoResultsArgs {
    columns: any[];
    noResultsText: string;
}
declare class RowNoResultsComponent extends Component<RowNoResultsArgs> {
    cellClassNames: string;
    get colspan(): number;
}
export { RowNoResultsComponent as default };
