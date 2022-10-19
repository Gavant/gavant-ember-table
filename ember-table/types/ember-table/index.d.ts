declare module 'ember-table/components/ember-table/component' {
    // eslint-disable-next-line ember/no-classic-components
    import Component from '@ember/component';

    import EmberTableLoadingMore from 'ember-table/components/ember-table-loading-more/component';
    import EmberTableBody from 'ember-table/components/ember-tbody/component';
    import EmberTableFooter from 'ember-table/components/ember-tfoot/component';
    import EmberTableHeader from 'ember-table/components/ember-thead/component';

    import { ComponentLike, WithBoundArgs } from '@glint/template';

    type HeaderCellComponent = ComponentLike<{
        Args: {
            columnValue: any;
            columnMeta: any;
            tableMeta: any;
        };
        Blocks: {
            default: [];
        };
    }>;

    type BodyCellComponent = ComponentLike<{
        Args: {
            cellValue: any;
            columnValue: any;
            rowValue: any;
            cellMeta: any;
            columnMeta: any;
            rowMeta: any;
            tableMeta: any;
        };
        Blocks: {
            default: [];
        };
    }>;

    type FooterCellComponent = BodyCellComponent;

    export interface Column {
        [key: string]: unknown;
        valuePath?: string;
        name?: string;
        width?: number;
        minWidth?: number;
        maxWidth?: number;
        textAlign?: string;
        isSortable?: boolean;
        headerComponent?: HeaderCellComponent;
        cellComponent?: BodyCellComponent;
        footerComponent?: FooterCellComponent;
        subcolumns?: Column[];
        footerValuePath: string;
    }

    export interface ColumnMeta {
        readonly isLeaf: boolean;
        readonly isFixed: boolean;
        readonly isReorderable: boolean;
        readonly isResizable: boolean;
        readonly isSortable: boolean;
        readonly offsetLeft: number;
        readonly offsetRight: number;
        readonly width: number;
        readonly columnSpan: number;
        readonly rowSpan: number;
        readonly index: number;
        readonly isMultiSorted: boolean;
        readonly isSorted: boolean;
        readonly isSortedAsc: boolean;
        readonly sortIndex: number;
    }

    export interface TableApi {
        columns: Column[];
        registerColumnTree: (columnTree: any) => void;
        columnTree: any;
        tableId: string;
    }
    export interface EmberTableSignature {
        Args: Record<string, unknown>;
        Blocks: {
            default: [
                {
                    api: any;
                    head: WithBoundArgs<typeof EmberTableHeader, 'api'>;
                    body: WithBoundArgs<typeof EmberTableBody, 'api'>;
                    foot: WithBoundArgs<typeof EmberTableFooter, 'api'>;
                    loadingMore: WithBoundArgs<typeof EmberTableLoadingMore, 'api'>;
                }
            ];
        };

        Element: HTMLDivElement;
    }

    type EmberTableArgs = EmberTableSignature['Args'];
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    export default interface EmberTable<T> extends EmberTableArgs {}

    // eslint-disable-next-line ember/require-tagless-components
    export default class EmberTable<T extends EmberTableSignature> extends Component<T> {
        elementId: string;

        api: TableApi;
    }
}

declare module '@gavant/ember-table/-private/sticky/legacy-sticky-polyfill';
declare module '@gavant/ember-table/-private/sticky/table-sticky-polyfill';
declare module 'ember-table/test-support';
