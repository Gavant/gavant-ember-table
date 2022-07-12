import Component from '@glimmer/component';
import { SelectionMode } from "../../../constants/table";
import { TableAPI, TableMeta } from "../../table/index";
interface TableRowArgs {
    api: TableAPI<any, any>;
    tableMeta?: TableMeta<any>;
    rowSelectionMode: SelectionMode;
    onClick?(...args: any[]): void;
    onDoubleClick?(...args: any[]): void;
}
declare class TableRow extends Component<TableRowArgs> {
    get rowValue(): any;
    get rowMeta(): import("../../table/index").RowMeta<any>;
    get cells(): import("../../table/index").TableCell<any, any>[];
    get rowSelectionMode(): SelectionMode;
    get isHeader(): boolean;
    get isSelected(): boolean;
    get isGroupSelected(): boolean;
    get isSelectable(): boolean;
    /**
     * Invoke the passed in "onRowClick" method, passing up
     * additional useful data.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    /**
     * Invoke the passed in "onRowClick" method, passing up
     * additional useful data.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    onClick(event: MouseEvent): void;
    /**
     * Invoke the passed in "onRowDoubleClick" method, passing up
     * additional useful data.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    /**
     * Invoke the passed in "onRowDoubleClick" method, passing up
     * additional useful data.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    onDoubleClick(event: MouseEvent): void;
}
export { TableRowArgs, TableRow as default };
