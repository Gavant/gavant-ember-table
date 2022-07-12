import { action } from '@ember/object';
import Component from '@glimmer/component';

import { SelectionMode } from '../../../constants/table';
import { TableAPI, TableMeta } from '../../table';

export interface TableRowArgs {
    api: TableAPI<any, any>;
    tableMeta?: TableMeta<any>;
    rowSelectionMode: SelectionMode;
    onClick?(...args: any[]): void;
    onDoubleClick?(...args: any[]): void;
}

export default class TableRow extends Component<TableRowArgs> {
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
