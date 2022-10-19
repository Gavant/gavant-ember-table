// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { action } from '@ember/object';
import Component from '@glimmer/component';

import { RowApi } from 'ember-table/components/ember-tr/component';

import { SelectionMode } from '../../../constants/table';
import { TableMeta } from '../../table';

export interface TableExpandedRowArgs {
    api: RowApi;
    tableMeta?: TableMeta<{ expandedRowComponent: typeof Component; expandedRows?: any[] }>;
    rowSelectionMode: SelectionMode;
    onClick?(...args: any[]): void;
    onDoubleClick?(...args: any[]): void;
}

interface TableExpandedRowSignature {
    Args: TableExpandedRowArgs;
    Blocks: {
        default: [
            {
                api: RowApi;
                cellValue: any;
                cellMeta: any;
                columnValue: any;
                columnMeta: any;
                rowValue: any;
                rowMeta: any;
                cell: any;
            }
        ];
    };
}

export default class ExpandableRow extends Component<TableExpandedRowSignature> {
    constructor(owner: unknown, args: TableExpandedRowArgs) {
        super(owner, args);
        if (!args.tableMeta?.expandedRowComponent) {
            throw new Error(
                '@gavant/ember-table: You must pass an expandedRowComponent to the table component when trying to use the expandable-row component'
            );
        }
    }
    get rowValue() {
        return this.args.api.rowValue;
    }

    get rowMeta() {
        return this.args.api.rowMeta;
    }

    get cells() {
        return this.args.api.cells;
    }

    get rowSelectionMode() {
        return this.args.rowSelectionMode;
    }

    get isHeader() {
        return this.args.api.isHeader;
    }

    get isSelected() {
        return this.rowMeta.isSelected;
    }

    get isGroupSelected() {
        return this.rowMeta.isGroupSelected;
    }

    get isSelectable() {
        return this.rowSelectionMode === SelectionMode.MULTIPLE || this.rowSelectionMode === SelectionMode.SINGLE;
    }

    get isExpanded() {
        return this.args.tableMeta?.expandedRows?.includes(this.rowValue) ?? false;
    }

    /**
     * Invoke the passed in "onRowClick" method, passing up
     * additional useful data.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    @action
    onClick(event: MouseEvent) {
        if (this.args.onClick) {
            const rowValue = this.rowValue;
            const rowMeta = this.rowMeta;
            const tableMeta = this.args.tableMeta;

            return this.args.onClick({ event, rowValue, rowMeta, tableMeta });
        }
    }

    /**
     * Invoke the passed in "onRowDoubleClick" method, passing up
     * additional useful data.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    @action
    onDoubleClick(event: MouseEvent) {
        if (this.args.onDoubleClick) {
            const rowValue = this.rowValue;
            const rowMeta = this.rowMeta;
            const tableMeta = this.args.tableMeta;

            return this.args.onDoubleClick({ event, rowValue, rowMeta, tableMeta });
        }
    }
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'Row::ExpandableRow': typeof ExpandableRow;
    }
}
