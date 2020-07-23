import Component from '@glimmer/component';
import { action } from '@ember/object';
import { TableAPI, RowMeta, TableMeta } from '@gavant/ember-table';

interface TableRowArgs {
    api: TableAPI<any>;
    rowMeta: RowMeta<any>;
    tableMeta: TableMeta;
    onClick?(...args: any[]): void;
    onDoubleClick?(...args: any[]): void;
}

enum SELECT_MODE {
    NONE = 'none',
    SINGLE = 'single',
    MULTIPLE = 'multiple'
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
        return this.args.api.rowSelectionMode;
    }

    get isHeader() {
        return this.args.api.isHeader;
    }

    get isSelected() {
        return this.args.rowMeta.isSelected;
    }

    get isGroupSelected() {
        return this.args.rowMeta.isGroupSelected;
    }

    get isSelectable() {
        return this.rowSelectionMode === SELECT_MODE.MULTIPLE || this.rowSelectionMode === SELECT_MODE.SINGLE;
    }

    get isExpanded() {
        return this.args.tableMeta.expandedRows?.includes(this.rowValue.id) ?? false;
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
