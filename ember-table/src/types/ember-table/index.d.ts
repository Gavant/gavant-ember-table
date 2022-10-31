declare module 'ember-table/components/ember-table/component' {
// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component';

import EmberTableLoadingMore from 'ember-table/components/ember-table-loading-more/component';
import EmberTableBody from 'ember-table/components/ember-tbody/component';
import EmberTableFooter from 'ember-table/components/ember-tfoot/component';
import EmberTableHeader from 'ember-table/components/ember-thead/component';

import { GetOrElse } from 'types/private';

import { ComponentLike, WithBoundArgs } from '@glint/template';

        type CellChildArgs<CV, CM, TM> = {
        columnValue: CV;
        columnMeta: CM;
        tableMeta: TM;
    };

    type HeaderCellComponent<CV, CM, TM> = ComponentLike<{
        Args: CellChildArgs<CV, CM, TM>;
    }>;

    type BodyCellComponent<
        CV extends Column<RV, M, CM, RM, TM>,
        RV extends RowValue,
        M,
        CM extends ColumnMeta,
        RM,
        TM
    > = ComponentLike<{
        Args: {
            cellValue: GetOrElse<RV, CV['valuePath'], never>;
            columnValue: CV;
            rowValue: RV;
            cellMeta: M;
            columnMeta: CM;
            rowMeta: RM;
            tableMeta: TM;
        };
    }>;

    export interface Column<RV extends RowValue, M, CM extends ColumnMeta, RM, TM> {
        [key: string]: any;
        valuePath?: string;
        name?: string;
        width?: number;
        minWidth?: number;
        maxWidth?: number;
        textAlign?: string;
        isSortable?: boolean;
        headerComponent?: HeaderCellComponent<Column<RV, M, CM, RM, TM>, CM, TM>;
        cellComponent?: BodyCellComponent<Column<RV, M, CM, RM, TM>, RV, M, CM, RM, TM>;
        subcolumns?: Column<RV, M, CM, RM, TM>[];
        footerValuePath?: string;
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
        readonly selected: boolean;
    }

    export type RowValue = { [foo: string]: any | never };

    export interface TableApi<
        CV extends Column<RV, M, CM, RM, TM>,
        RV extends RowValue,
        M,
        CM extends ColumnMeta,
        RM,
        TM
    > {
        columns: CV[];
        registerColumnTree: (columnTree: any) => void;
        columnTree: any;
        tableId: string;
    }
    export interface EmberTableSignature<
        CV extends Column<RV, M, CM, RM, TM>,
        RV extends RowValue,
        M,
        CM extends ColumnMeta,
        RM,
        TM
    > {
        Args: Record<string, unknown>;
        Blocks: {
            default: [
                {
                    api: TableApi<CV, RV, M, CM, RM, TM>;
                    head: WithBoundArgs<typeof EmberTableHeader<CV, RV, M, CM, RM, TM>, 'api'>;
                    body: WithBoundArgs<typeof EmberTableBody<CV, RV, M, CM, RM, TM>, 'api'>;
                    foot: WithBoundArgs<typeof EmberTableFooter<CV, RV, M, CM, RM, TM>, 'api'>;
                    loadingMore: WithBoundArgs<typeof EmberTableLoadingMore, 'api'>;
                }
            ];
        };

        Element: HTMLDivElement;
    }

    type EmberTableArgs<
        CV extends Column<RV, M, CM, RM, TM>,
        RV extends RowValue,
        M,
        CM extends ColumnMeta,
        RM,
        TM
    > = EmberTableSignature<CV, RV, M, CM, RM, TM>['Args'];
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    export default interface EmberTable<
        CV extends Column<RV, M, CM, RM, TM>,
        RV extends RowValue,
        M,
        CM extends ColumnMeta,
        RM,
        TM
    > extends EmberTableArgs<CV, RV, M, CM, RM, TM> {}

    export default class EmberTable<
        CV extends Column<RV, M, CM, RM, TM>,
        RV extends RowValue,
        M,
        CM extends ColumnMeta,
        RM,
        TM

        // eslint-disable-next-line ember/require-tagless-components
    > extends Component<EmberTableSignature<CV, RV, M, CM, RM, TM>> {
        elementId: string;

        api: TableApi<CV, RV, M, CM, RM, TM>;
    }
}

declare module '@gavant/ember-table/-private/sticky/legacy-sticky-polyfill';
declare module '@gavant/ember-table/-private/sticky/table-sticky-polyfill';
declare module 'ember-table/test-support';
