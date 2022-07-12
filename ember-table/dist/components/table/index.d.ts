/// <reference types="ember__array" />
/// <reference types="ember__template" />
import NativeArray from '@ember/array/-private/native-array';
import { SafeString } from '@ember/template/-private/handlebars';
import Component from '@glimmer/component';
import { FillMode, ResizeMode, WidthConstraint } from "../../constants/table";
interface ColumnValue {
    id?: string;
    valuePath?: string;
    name: string;
    isFixedLeft?: boolean;
    width: number;
    staticWidth: number;
    minWidth?: number;
    maxWidth?: number;
    textAlign?: string;
    isSortable?: boolean;
    headerClassNames?: string;
    headerComponent?: string;
    cellClassNames?: string;
    cellComponent?: string;
    footerValuePath?: string;
    footerClassNames?: string;
    footerComponent?: string;
    subcolumns?: ColumnValue[];
}
interface TableSort {
    valuePath: string;
    isAscending: boolean;
}
type TableMeta<M> = {
    [P in keyof M]: M[P];
};
interface ColumnMeta {
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
interface RowMeta<T> {
    readonly index: number;
    readonly canCollapse: boolean;
    readonly depth: number;
    readonly isCollapsed: boolean;
    readonly isGroupSelected: boolean;
    readonly isSelected: boolean;
    readonly first: T;
    readonly last: T;
    readonly next: T;
    readonly prev: T;
    select(arg0: RowMetaSelect): void;
}
interface RowMetaSelect {
    toggle?: boolean;
    range?: boolean;
    single?: boolean;
}
interface RowClickEvent<T, TM> {
    event: MouseEvent;
    rowValue: T;
    rowMeta: RowMeta<T>;
    tableMeta?: TableMeta<TM>;
}
interface TableAPI<T, TM> {
    cells: TableCell<T, TM>[];
    rowMeta: RowMeta<T>;
    rowValue: T;
    isHeader: boolean;
}
interface TableCell<T, TM> {
    columnMeta: ColumnMeta;
    columnValue: ColumnValue;
    rowMeta: RowMeta<T>;
    rowValue: T;
    cellValue: any;
    tableMeta?: TableMeta<TM>;
}
/**
 * T - Table rows
 * TM - Table Meta
 *
 * @export
 * @interface TBodyArgs
 * @template T
 * @template TM
 */
interface TBodyArgs<T, TM> {
    /**
     * The number of extra rows to render on either side of the table's viewport
     *
     * @type {number}
     * @memberof TBodyArgs
     */
    bufferSize?: number;
    /**
     * Sets which row selection behavior to follow. Possible values are 'none' (clicking on a row does nothing),
     * 'single' (clicking on a row selects it and deselects other rows), and 'multiple' (multiple rows can be selected through ctrl/cmd-click or shift-click).
     *
     * @type {SelectionMode}
     * @memberof TBodyArgs
     */
    checkboxSelectionMode?: SelectionMode;
    /**
     * A selector string that will select the element from which to calculate the viewable height.
     * Set to null for fixed height tables
     *
     * @type {string}
     * @memberof TBodyArgs
     */
    containerSelector?: string;
    /**
     * Boolean flag that enables collapsing tree nodes
     *
     * @type {boolean}
     * @memberof TBodyArgs
     */
    enableCollapse?: boolean;
    /**
     * Boolean flag that enables tree behavior if items have a `children` property
     *
     * @type {boolean}
     * @memberof TBodyArgs
     */
    enableTree?: boolean;
    /**
     * Estimated height for each row. This number is used to decide how many rows will be rendered at initial rendering.
     *
     * @type {number}
     * @memberof TBodyArgs
     */
    estimateRowHeight?: number;
    /**
     * An action that is triggered when the first visible row of the table changes.
     *
     * @memberof TBodyArgs
     */
    firstVisibleChanged?: () => void;
    /**
     * The property is passed through to the vertical-collection. If set,
     * upon initialization the scroll position will be set such that the item with the provided id is at the top left on screen.
     * If the item with id cannot be found, scrollTop is set to 0.
     *
     * @type {string}
     * @memberof TBodyArgs
     */
    idForFirstItem?: string;
    /**
     * This key is the property used by the collection to determine whether an array mutation is an append, prepend, or complete replacement.
     * It is also the key that is passed to the actions, and can be used to restore scroll position with idForFirstItem. This is passed through to the vertical-collection.
     *
     * @type {string}
     * @memberof TBodyArgs
     */
    key?: string;
    /**
     * An action that is triggered when the last visible row of the table changes.
     *
     * @memberof TBodyArgs
     */
    lastVisibleChanged?: () => void;
    /**
     * An action that is called when the row selection of the table changes. Will be called with either an array or individual row, depending on the checkboxSelectionMode.
     *
     * @memberof TBodyArgs
     */
    onSelect?: () => void;
    /**
     * A flag that tells the table to render all of its rows at once.
     *
     * @type {boolean}
     * @memberof TBodyArgs
     */
    renderAll?: boolean;
    /**
     * The row items that the table should display
     *
     * @type {T[]}
     * @memberof TBodyArgs
     */
    rows: T[];
    /**
     * Sets which checkbox selection behavior to follow. Possible values are 'none' (clicking on a row does nothing),
     * 'single' (clicking on a row selects it and deselects other rows), and 'multiple' (multiple rows can be selected through ctrl/cmd-click or shift-click).
     *
     * @type {SelectionMode}
     * @memberof TBodyArgs
     */
    rowSelectionMode?: SelectionMode;
    /**
     * When true, this option causes selecting all of a node's children to also select the node itself.
     *
     * @type {boolean}
     * @memberof TBodyArgs
     */
    selectingChildrenSelectsParents?: boolean;
    /**
     * The currently selected rows. Can either be an array or an individual row.
     *
     * @type {(T[] | T | null)}
     * @memberof TBodyArgs
     */
    selection?: T[] | T | null;
    /**
     * A function that will override how selection is compared to row value.
     *
     * @memberof TBodyArgs
     */
    selectionMatchFunction?: () => void;
    /**
     * A flag that controls if all rows have same static height or not.
     * By default it is set to false and row height is dependent on its internal content.
     * If it is set to true, all rows have the same height equivalent to estimateRowHeight.
     *
     * @type {boolean}
     * @memberof TBodyArgs
     */
    staticHeight?: boolean;
    /**
     * Table meta object - this is used to pass actions and data to any part of the table from outside
     *
     * @type {TableMeta}
     * @memberof TBodyArgs
     */
    tableMeta?: TableMeta<TM>;
}
interface THeadArgs<TM> {
    /**
     * The column definitions for the table
     *
     * @type {NativeArray<ColumnValue>}
     * @memberof THeadArgs
     */
    columns: NativeArray<ColumnValue>;
    /**
     * An ordered array of the sorts applied to the table
     *
     * @memberof THeadArgs
     */
    compareFunction?: <T>(valueA: T, valueB: T, sortEmptyLast: boolean) => number;
    /**
     * A numeric adjustment to be applied to the constraint on the table's size.
     *
     * @type {number}
     * @memberof THeadArgs
     */
    containerWidthAdjustment?: number;
    /**
     * Flag that toggles reordering in the table
     *
     * @type {boolean}
     * @memberof THeadArgs
     */
    enableReorder?: boolean;
    /**
     * ember-table's resizing must be enabled in order for fill-mode auto column
     * resizing to work, even if you don't want to allow user-invoked resizing
     *
     * @type {boolean}
     * @memberof THeadArgs
     */
    readonly enableResize?: true;
    /**
     * A configuration that controls which column shrinks (or extends) when fillMode is 'nth-column'. This is zero indexed.
     *
     * @type {number}
     * @memberof THeadArgs
     */
    fillColumnIndex?: number;
    /**
     * A configuration that controls how columns shrink (or extend) when total column width does not match table width. Behavior of column modification is as follows:

        "equal-column": extra space is distributed equally among all columns

        "first-column": extra space is added into the first column.

        "last-column": extra space is added into the last column.

        "nth-column": extra space is added into the column defined by fillColumnIndex.
     *
     * @type {FillMode}
     * @memberof THeadArgs
     */
    fillMode?: FillMode;
    /**
     * Specifies how columns should be sized when the table is initialized.
     * This only affects eq-container-slack and gte-container-slack width constraint modes. Permitted values are the same as fillMode.
     *
     * @type {FillMode}
     * @memberof THeadArgs
     */
    initialFillMode?: FillMode;
    /**
     * An action that is sent when sorts is updated
     *
     * @memberof THeadArgs
     */
    onHeaderAction?: () => void;
    /**
     * An action that is sent when columns are reordered
     *
     * @memberof THeadArgs
     */
    onReorder?: () => void;
    /**
     * An action that is sent when columns are resized
     *
     * @memberof THeadArgs
     */
    onResize?: () => void;
    /**
     * An action that is sent when sorts is updated
     *
     * @memberof THeadArgs
     */
    onUpdateSorts?: (sorts: TableSort[]) => void;
    /**
     * Sets which column resizing behavior to use.
     * Possible values are standard (resizing a column pushes or pulls all other columns) and fluid (resizing a column subtracts width from neighboring columns).
     *
     * @type {ResizeMode}
     * @memberof THeadArgs
     */
    resizeMode?: ResizeMode;
    /**
     * Enables shadows at the edges of the table to show that the user can scroll to view more content.
     * Possible string values are all, horizontal, vertical, and none. The boolean values true and false are aliased to all and none, respectively.
     *
     * @type {(boolean | string)}
     * @memberof THeadArgs
     */
    scrollIndicators?: boolean | string;
    /**
     * Flag that allows to sort empty values after non empty ones
     *
     * @type {boolean}
     * @memberof THeadArgs
     */
    sortEmptyLast?: boolean;
    /**
     * An optional sort. If not specified, defaults to , which sorts by each sort in sorts, in order.
     *
     * @memberof THeadArgs
     */
    sortFunction?: (itemA: ColumnValue, itemB: ColumnValue, sorts: TableSort[], compare: <T>(valueA: T, valueB: T, sortEmptyLast: boolean) => number, sortEmptyLast: boolean) => number;
    /**
     * An ordered array of the sorts applied to the table
     *
     * @type {TableSort[]}
     * @memberof THeadArgs
     */
    sorts?: TableSort[];
    /**
     * Table meta object - this is used to pass actions and data to any part of the table from outside
     *
     * @type {TableMeta}
     * @memberof TBodyArgs
     */
    tableMeta?: TableMeta<TM>;
    /**
     * Sets a constraint on the table's size, such that it must be greater than, less than, or equal to the size of the containing element.
     *
     * @type {WidthConstraint}
     * @memberof THeadArgs
     */
    widthConstraint?: WidthConstraint;
}
interface TableArgs<R, F, TM> extends TBodyArgs<R, TM>, THeadArgs<TM> {
    /**
     * Manually change the panning of the table
     *
     * @type {number}
     * @memberof TableArgs
     */
    columnPanPosition?: number;
    /**
     * On visible columns change event
     *
     * @memberof TableArgs
     */
    onVisibleColumnsChange?: (columns: ColumnValue[]) => void;
    /**
     * Load previous rows of items
     *
     * @memberof TableArgs
     */
    loadPreviousRows?: () => Promise<R[]>;
    /**
     * Load more rows of items
     *
     * @memberof TableArgs
     */
    loadMoreRows?: () => Promise<R[]>;
    /**
     * Event to handle click on row
     *
     * @memberof TableArgs
     */
    onRowClick?: <T>(rowClickEvent: RowClickEvent<T, TM>) => void;
    /**
     * Event to handle double click on row
     *
     * @memberof TableArgs
     */
    onRowDoubleClick?: () => void;
    /**
     * Used to correct the layout on mobile when showing the table
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    isMobile?: boolean;
    /**
     * Enable/Disable row sorting
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    enableSort?: boolean;
    /**
     * Forces the columns to fit within the table container on any column visibility update.
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    constrainColumnsToFit?: boolean;
    /**
     * Enable/disable hover on rows
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    hoverableRows?: boolean;
    /**
     * Enable/disable column re-sizing. Note: Column objects with max/min widths will not be resizable.
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    enableUserResize?: boolean;
    /**
     * Enable/disable column visibility updates on width resizing
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    resizeWidthSensitive?: boolean;
    /**
     * Enable/disabled striped rows
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    stripedRows?: boolean;
    /**
     * Enable/disable the footer when empty
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    showEmptyFooter?: boolean;
    /**
     * Enable/disable the table header
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    showHeader?: boolean;
    /**
     * Appends 'table-sm' to the table class when true.
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    small?: boolean;
    /**
     * Table meta object - this is used to pass actions and data to any part of the table from outside
     *
     * @type {TableMeta<TM>}
     * @memberof TableArgs
     */
    tableMeta?: TableMeta<TM>;
    /**
     * The footer rows to be displayed. i.e. for a table with a 'subtotal' column:
        `[{ subtotal:500 }]`
     *
     * @type {NativeArray<F>}
     * @memberof TableArgs
     */
    footerRows?: NativeArray<F>;
    /**
     * Displayed when there are no rows
     *
     * @type {string}
     * @memberof TableArgs
     */
    noResultsText?: string;
    /**
     * The class given to the pan-buttons when there are hidden columns
     *
     * @type {string}
     * @memberof TableArgs
     */
    panButtonClass?: string;
    /**
     * The debounce time used by the resize listener to update column visibility.
     *
     * @type {number}
     * @memberof TableArgs
     */
    resizeDebounce?: number;
    /**
     * The class for the EmberTable
     *
     * @type {string}
     * @memberof TableArgs
     */
    tableClass?: string;
    /**
     * The height style given to the table. i.e. '50vh' or `200`
     * if a number is passed in, we automatically assume its in pixels
     *
     * @type {string}
     * @memberof TableArgs
     */
    tableHeight?: string | number;
    /**
     * When column headers are "sticky", this sets their offset (in pixels) from the top of the scrollable container
     *
     * @type {number}
     * @memberof TableArgs
     */
    headerStickyOffset?: number;
    /**
     * When column footers are "sticky", this sets their offset (in pixels) from the bottom of the scrollable container
     *
     * @type {number}
     * @memberof TableArgs
     */
    footerStickyOffset?: number;
    /**
     * Component name to render instead of the default row component
     *
     * @type {string}
     * @memberof TableArgs
     */
    rowComponent?: string;
    /**
     * Whether or not there are more rows to load
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    hasMoreRows?: boolean;
    /**
     * Boolean that tells us whether we are loading more data
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    isLoading?: boolean;
    /**
     * Boolean to render all rows for vertical collection
     *
     * @type {boolean}
     * @memberof TableArgs
     */
    renderAll?: boolean;
}
declare class TableComponent<R, F, TM> extends Component<TableArgs<R, F, TM>> {
    readonly enableResize: boolean;
    readonly elementId: string;
    /**
     * Returns a unique data-table ID
     *
     * @readonly
     * @type {string} tableId
     * @memberof TableComponent
     */
    get tableId(): string;
    /**
     * CSS style for the table height
     *
     *
     * @readonly
     * @type {string} height
     * @memberof TableComponent
     */
    get height(): SafeString;
    get nonBreakingSpace(): SafeString;
    bufferSize: number;
    containerSelector: string;
    constrainColumnsToFit: boolean;
    enableReorder: boolean;
    enableSort: boolean;
    enableUserResize: boolean;
    estimateRowHeight: number;
    fillColumnIndex: number | null;
    fillMode: string;
    footerRows: Array<F>;
    hasMoreRows: boolean;
    hoverableRows: boolean;
    isLoading: boolean;
    noResultsText: string;
    panButtonClass: string;
    renderAll: boolean;
    resizeDebounce: number;
    resizeMode: string;
    resizeWidthSensitive: boolean;
    rowComponent: string;
    showEmptyFooter: boolean;
    showHeader: boolean;
    small: boolean;
    sortEmptyLast: boolean;
    stripedRows: boolean;
    tableClass: string;
    tableHeight: string | number;
    widthConstraint: string;
    headerStickyOffset: number;
    footerStickyOffset: number;
    sorts: TableSort[];
    key: string;
    isMobile: boolean;
    columnPanPosition: number;
    containerWidth: number | null;
    visibleColumns: ColumnValue[];
    containerElement: HTMLElement | null;
    get noRows(): boolean;
    get notLoading(): boolean;
    get showBottomLoading(): boolean;
    get showTopLoading(): boolean;
    /**
     * Returns whether the table rows are clickable.
     *
     * @readonly
     * @type {boolean}
     */
    get clickableRows(): boolean;
    /**
     * Returns whether a fully-loaded table is empty.
     *
     * @readonly
     * @type {boolean}
     */
    get isEmpty(): boolean;
    /**
     * Returns whether there are non-render columns.
     *
     * @readonly
     * @type {boolean}
     */
    get hasHiddenColumns(): boolean;
    /**
     * Returns whether the table is currently panned.
     *
     * @readonly
     * @type {boolean}
     */
    get isColumnsPanned(): boolean;
    /**
     * Returns true when `containerWidth` >= `minFixedColTableWidth`.
     *
     * @readonly
     * @type {boolean}
     */
    get allowFixedCols(): boolean;
    /**
     * Returns which column should be used as the first visible column.
     *
     * @readonly
     */
    get firstVisibleColumn(): ColumnValue | undefined;
    /**
     * Returns the first visible non-fixed column.
     *
     * @readonly
     * @type {(ColumnValue | undefined)}
     */
    get firstVisibleNonFixedColumn(): ColumnValue | undefined;
    /**
     * Returns the array of fixed columns.
     *
     * @readonly
     * @type {NativeArray<ColumnValue>}
     */
    get fixedColumns(): NativeArray<ColumnValue>;
    /**
     * Returns the array of non-fixed columns.
     *
     * @readonly
     * @type {NativeArray<ColumnValue>}
     */
    get nonFixedColumns(): NativeArray<ColumnValue>;
    /**
     * Determines the minimum table width when
     * fixed columns are present, else returns 0
     *
     * @readonly
     * @type {number} minFixedColTableWidth
     * @memberof TableComponent
     */
    get minFixedColTableWidth(): number;
    /**
     * Returns the table's current ability to pan right.
     * Columns can be panned right if there are hidden columns
     * and the last visible column is not the last defined column
     *
     * @readonly
     * @type {boolean} canPanRight
     * @memberof TableComponent
     */
    get canPanRight(): boolean;
    /**
     * Returns the table's ability to pan left.
     * Columns can be panned left if there are hidden columns
     * and the first visible column (first NON-FIXED visible column, if fixed columns are enabled)
     * is not the first defined column
     *
     * @readonly
     * @type {boolean} canPanLeft
     * @memberof TableComponent
     */
    get canPanLeft(): boolean;
    /**
     * Returns a class string that includes all of
     * the enabled properties
     *
     * @readonly
     * @type {string} tableClassNames
     * @memberof TableComponent
     */
    get tableClassNames(): string;
    /**
     * Returns a new fillColumnIndex when the current
     * fillColumnIndex is out of range
     *
     * @readonly
     * @type {(number | null)} adjustedFillColumnIndex
     * @memberof TableComponent
     */
    get adjustedFillColumnIndex(): number;
    /**
     * Initialize the table component's `visibleColumns`
     *
     * @memberof TableComponent
     */
    //methods
    /**
     * Initialize the table component's `visibleColumns`
     *
     * @memberof TableComponent
     */
    constructor(owner: unknown, args: TableArgs<R, F, TM>);
    /**
     * Handles initial column visibility manipulation when the table is first rendered
     *
     * @memberof TableComponent
     */
    /**
     * Handles initial column visibility manipulation when the table is first rendered
     *
     * @memberof TableComponent
     */
    didInsertTable(): void;
    /**
     * Handle component container element resize events and hide/show columns as needed.
     * Resets pan position on container resize
     *
     * @memberof TableComponent
     */
    /**
     * Handle component container element resize events and hide/show columns as needed.
     * Resets pan position on container resize
     *
     * @memberof TableComponent
     */
    debouncedRender(): void;
    /**
     * Manually update the pan position if the calling component tells us to
     *
     * @memberof TableComponent
     */
    /**
     * Manually update the pan position if the calling component tells us to
     *
     * @memberof TableComponent
     */
    updatePanPosition(): void;
    /**
     * Hides and shows table columns depending on the available container width
     *
     * @memberof TableComponent
     */
    /**
     * Hides and shows table columns depending on the available container width
     *
     * @memberof TableComponent
     */
    updateColumnVisibility(): void;
    /**
     * Pans the table's visible column to the left or right the provided number of columns
     * e.g. `-1` pans one column to the left, `2` pans two columns to the right
     *
     * @param {number} moveIndex -- A number indicating the number of columns to pan
     * @memberof TableComponent
     */
    /**
     * Pans the table's visible column to the left or right the provided number of columns
     * e.g. `-1` pans one column to the left, `2` pans two columns to the right
     *
     * @param {number} moveIndex -- A number indicating the number of columns to pan
     * @memberof TableComponent
     */
    private panColumns;
    /**
     * Returns the computed width for the given element
     *
     * @param {Element} el -- A DOM element
     * @returns {number}
     * @memberof TableComponent
     */
    /**
     * Returns the computed width for the given element
     *
     * @param {Element} el -- A DOM element
     * @returns {number}
     * @memberof TableComponent
     */
    private getElementWidth;
    /**
     * Returns the column's unique identifier or undefined.
     * Allow columns to specify an "id" if they dont have a valuePath, or the valuePath is not unique
     *
     * @param {(ColumnValue | undefined)} col - A table column
     * @returns {(string | undefined)}
     * @memberof TableComponent
     */
    /**
     * Returns the column's unique identifier or undefined.
     * Allow columns to specify an "id" if they dont have a valuePath, or the valuePath is not unique
     *
     * @param {(ColumnValue | undefined)} col - A table column
     * @returns {(string | undefined)}
     * @memberof TableComponent
     */
    getColumnId(col?: ColumnValue): string | undefined;
    /**
     * Invokes an action to load a new page of rows when the first row in the table is reached/in view
     *
     * @returns {Promise | void}
     * @memberof TableComponent
     */
    //actions
    /**
     * Invokes an action to load a new page of rows when the first row in the table is reached/in view
     *
     * @returns {Promise | void}
     * @memberof TableComponent
     */
    onFirstReached(): Promise<R[]> | undefined;
    /**
     * Invokes an action to load a new page of rows when the last row in the table is reached/in view
     *
     * @returns {Promise | void}
     * @memberof TableComponent
     */
    /**
     * Invokes an action to load a new page of rows when the last row in the table is reached/in view
     *
     * @returns {Promise | void}
     * @memberof TableComponent
     */
    onLastReached(): Promise<R[]> | undefined;
    /**
     * Pans the table's visible columns to the left
     *
     * @returns {void}
     * @memberof TableComponent
     */
    /**
     * Pans the table's visible columns to the left
     *
     * @returns {void}
     * @memberof TableComponent
     */
    panColumnsLeft(): void;
    /**
     * Pans the table's visible columns to the right
     *
     * @returns {void}
     * @memberof TableComponent
     */
    /**
     * Pans the table's visible columns to the right
     *
     * @returns {void}
     * @memberof TableComponent
     */
    panColumnsRight(): void;
    /**
     * Updates the table's column sorting
     *
     * @param {any[]} sorts
     * @returns {Promise}
     * @memberof TableComponent
     */
    /**
     * Updates the table's column sorting
     *
     * @param {any[]} sorts
     * @returns {Promise}
     * @memberof TableComponent
     */
    onUpdateSorts(sorts: TableSort[]): void;
}
export { TableComponent as default, ColumnValue, TableSort, TableMeta, ColumnMeta, RowMeta, RowClickEvent, TableAPI, TableCell, TBodyArgs, THeadArgs, TableArgs };
