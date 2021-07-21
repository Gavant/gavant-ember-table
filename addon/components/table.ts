import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { scheduleOnce } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import { SafeString } from '@ember/template/-private/handlebars';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { argDefault } from '@gavant/ember-table/decorators/table';

export enum SelectionMode {
    NONE = 'none',
    SINGLE = 'single',
    MULTIPLE = 'multiple'
}

export enum FillMode {
    EQUAL = 'equal-column',
    FIRST = 'first-column',
    LAST = 'last-column',
    NTH = 'nth-column'
}

export enum ResizeMode {
    STANDARD = 'standard',
    FLUID = 'fluid'
}

export enum WidthConstraint {
    NONE = 'none',
    EQUAL = 'eq-container',
    GREATER_THAN = 'gte-container',
    LESS_THAN = 'lte-container'
}

export interface ColumnValue {
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

export interface TableSort {
    valuePath: string;
    isAscending: boolean;
}

export type TableMeta<M> = { [P in keyof M]: M[P] };

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

export interface RowMeta<T> {
    //attributes
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

    //methods
    select(arg0: RowMetaSelect): void;
}

interface RowMetaSelect {
    toggle?: boolean;
    range?: boolean;
    single?: boolean;
}

export interface RowClickEvent<T, TM> {
    event: MouseEvent;
    rowValue: T;
    rowMeta: RowMeta<T>;
    tableMeta?: TableMeta<TM>;
}

export interface TableAPI<T, TM> {
    cells: TableCell<T, TM>[];
    rowMeta: RowMeta<T>;
    rowValue: T;
    isHeader: boolean;
}

export interface TableCell<T, TM> {
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
export interface TBodyArgs<T, TM> {
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

export interface THeadArgs<TM> {
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
    sortFunction?: (
        itemA: ColumnValue,
        itemB: ColumnValue,
        sorts: TableSort[],
        compare: <T>(valueA: T, valueB: T, sortEmptyLast: boolean) => number,
        sortEmptyLast: boolean
    ) => number;

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

export interface TableArgs<R, F, TM> extends TBodyArgs<R, TM>, THeadArgs<TM> {
    /**
     * Manually change the panning of the table
     *
     * @type {number}
     * @memberof TableArgs
     */
    columnPanPosition?: number;

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
}

class TableComponent<R, F, TM> extends Component<TableArgs<R, F, TM>> {
    //ember-table's resizing must be enabled in order for fill-mode auto column
    //resizing to work, even if you don't want to allow user-invoked resizing
    readonly enableResize: boolean = true;
    readonly elementId = guidFor(this);

    /**
     * Returns a unique data-table ID
     *
     * @readonly
     * @type {string} tableId
     * @memberof TableComponent
     */
    get tableId(): string {
        return `data-table-${this.elementId}`;
    }

    /**
     * CSS style for the table height
     *
     *
     * @readonly
     * @type {string} height
     * @memberof TableComponent
     */
    get height(): SafeString {
        const isNumber = typeof this.tableHeight === 'number';
        return htmlSafe(this.tableHeight ? `height: ${this.tableHeight}${isNumber ? 'px' : ''};` : '');
    }

    @argDefault bufferSize: number = 0;
    @argDefault containerSelector: string = 'body';
    @argDefault constrainColumnsToFit: boolean = true;
    @argDefault enableReorder: boolean = false;
    @argDefault enableSort: boolean = false;
    @argDefault enableUserResize: boolean = false;
    @argDefault estimateRowHeight: number = 30;
    @argDefault fillColumnIndex: number | null = null;
    @argDefault fillMode: string = FillMode.FIRST;
    @argDefault footerRows: Array<F> = [];
    @argDefault hasMoreRows: boolean = false;
    @argDefault hoverableRows: boolean = true;
    @argDefault isLoading: boolean = false;
    @argDefault noResultsText: string = 'No results found';
    @argDefault panButtonClass: string = 'btn btn-secondary';
    @argDefault renderAll: boolean = false;
    @argDefault resizeDebounce: number = 250;
    @argDefault resizeMode: string = 'standard';
    @argDefault resizeWidthSensitive: boolean = true;
    @argDefault rowComponent: string = 'ember-tr';
    @argDefault showEmptyFooter: boolean = false;
    @argDefault showHeader: boolean = true;
    @argDefault small: boolean = false;
    @argDefault sortEmptyLast: boolean = false;
    @argDefault stripedRows: boolean = false;
    @argDefault tableClass: string = 'table';
    @argDefault tableHeight: string | number = '';
    @argDefault widthConstraint: string = 'lte-container';
    @argDefault headerStickyOffset: number = 0;
    @argDefault footerStickyOffset: number = 0;
    @argDefault sorts: TableSort[] = [];
    @argDefault key: string = '@identity';
    @argDefault isMobile: boolean = false;

    //component state
    @tracked columnPanPosition: number = this.args.columnPanPosition ?? 0;
    @tracked containerWidth: number | null = null;
    @tracked visibleColumns: NativeArray<ColumnValue> = A();
    @tracked containerElement: HTMLElement | null = null;

    get noRows(): boolean {
        return this.args.rows.length === 0;
    }

    get notLoading(): boolean {
        return !this.isLoading;
    }

    get showBottomLoading() {
        return !!this.args.loadMoreRows;
    }

    get showTopLoading() {
        return !!this.args.loadPreviousRows;
    }

    /**
     * Returns whether the table rows are clickable.
     *
     * @readonly
     * @type {boolean}
     */
    get clickableRows(): boolean {
        return !!this.args.onRowClick || !!this.args.onRowDoubleClick;
    }

    /**
     * Returns whether a fully-loaded table is empty.
     *
     * @readonly
     * @type {boolean}
     */
    get isEmpty(): boolean {
        return this.noRows && this.notLoading;
    }

    /**
     * Returns whether there are non-render columns.
     *
     * @readonly
     * @type {boolean}
     */
    get hasHiddenColumns(): boolean {
        return this.visibleColumns.length < this.args.columns.length;
    }

    /**
     * Returns whether the table is currently panned.
     *
     * @readonly
     * @type {boolean}
     */
    get isColumnsPanned(): boolean {
        return this.columnPanPosition > 0;
    }

    /**
     * Returns true when `containerWidth` >= `minFixedColTableWidth`.
     *
     * @readonly
     * @type {boolean}
     */
    get allowFixedCols(): boolean {
        return (this.containerWidth ?? 0) >= this.minFixedColTableWidth;
    }

    /**
     * Returns which column should be used as the first visible column.
     *
     * @readonly
     */
    get firstVisibleColumn() {
        return this.allowFixedCols ? this.firstVisibleNonFixedColumn : this.visibleColumns[0];
    }

    /**
     * Returns the first visible non-fixed column.
     *
     * @readonly
     * @type {(ColumnValue | undefined)}
     */
    get firstVisibleNonFixedColumn(): ColumnValue | undefined {
        return this.visibleColumns && this.visibleColumns.find((col) => !col.isFixedLeft);
    }

    /**
     * Returns the array of fixed columns.
     *
     * @readonly
     * @type {NativeArray<ColumnValue>}
     */
    get fixedColumns(): NativeArray<ColumnValue> {
        return A((this.args.columns || A()).filter((col) => col.isFixedLeft));
    }

    /**
     * Returns the array of non-fixed columns.
     *
     * @readonly
     * @type {NativeArray<ColumnValue>}
     */
    get nonFixedColumns(): NativeArray<ColumnValue> {
        return A((this.args.columns || A()).filter((col) => !col.isFixedLeft));
    }

    /**
     * Determines the minimum table width when
     * fixed columns are present, else returns 0
     *
     * @readonly
     * @type {number} minFixedColTableWidth
     * @memberof TableComponent
     */
    get minFixedColTableWidth(): number {
        //fixed columns are disabled if the widest non-fixed column cannot
        //fit in the container at the same time as the fixed column(s)
        if (!isEmpty(this.fixedColumns)) {
            const sortedColumns = this.nonFixedColumns.sortBy('staticWidth');
            const widestColumn = sortedColumns[sortedColumns.length - 1];
            const widestColumnWidth = widestColumn ? widestColumn.staticWidth : 0;
            const fixedWidth = this.fixedColumns.reduce((prev, col) => prev + col.staticWidth, 0);
            return widestColumnWidth + fixedWidth;
        } else {
            return 0;
        }
    }

    /**
     * Returns the table's current ability to pan right.
     * Columns can be panned right if there are hidden columns
     * and the last visible column is not the last defined column
     *
     * @readonly
     * @type {boolean} canPanRight
     * @memberof TableComponent
     */
    get canPanRight(): boolean {
        const lastColId = this.getColumnId(this.args.columns[this.args.columns.length - 1]);
        const visibleColId = this.getColumnId(this.visibleColumns[this.visibleColumns.length - 1]);
        return this.hasHiddenColumns && Boolean(lastColId && visibleColId) && lastColId !== visibleColId;
    }

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
    get canPanLeft(): boolean {
        const firstColId = this.getColumnId(this.args.columns[0]);
        const nonFixedColId = this.getColumnId(this.nonFixedColumns[0]);
        const colId = this.allowFixedCols ? nonFixedColId : firstColId;
        const visibleColId = this.getColumnId(this.firstVisibleColumn);
        return this.hasHiddenColumns && Boolean(colId && visibleColId) && colId !== visibleColId;
    }

    /**
     * Returns a class string that includes all of
     * the enabled properties
     *
     * @readonly
     * @type {string} tableClassNames
     * @memberof TableComponent
     */
    get tableClassNames(): string {
        const classNames = A([this.tableClass]);

        if (!this.showHeader) {
            classNames.pushObject('table-no-header');
        }

        if (this.stripedRows) {
            classNames.pushObject('table-striped');
        }

        if (this.hoverableRows) {
            classNames.pushObject('table-hover');
        }

        if (this.clickableRows) {
            classNames.pushObject('table-clickable-rows');
        }

        if (this.small) {
            classNames.pushObject('table-sm');
        }

        return classNames.join(' ');
    }

    /**
     * Returns a new fillColumnIndex when the current
     * fillColumnIndex is out of range
     *
     * @readonly
     * @type {(number | null)} adjustedFillColumnIndex
     * @memberof TableComponent
     */
    get adjustedFillColumnIndex(): number {
        if (this.fillColumnIndex) {
            return this.fillColumnIndex > this.visibleColumns.length - 1 ? 0 : this.fillColumnIndex;
        } else {
            return 0;
        }
    }

    //methods

    /**
     * Initialize the table component's `visibleColumns`
     *
     * @memberof TableComponent
     */
    constructor(owner: unknown, args: TableArgs<R, F, TM>) {
        super(owner, args);

        assert('@rows is not an instanceof Array.', args.rows instanceof Array);
        assert('@columns is not an instanceof Array', args.columns instanceof Array);
        this.visibleColumns = this.args.columns;
    }

    /**
     * Handles initial column visibility manipulation when the table is first rendered
     *
     * @memberof TableComponent
     */
    @action
    didInsertTable() {
        this.containerElement = document.getElementById(this.elementId);
        if (this.constrainColumnsToFit) {
            scheduleOnce('afterRender', this, 'updateColumnVisibility');
        }
    }

    /**
     * Handle component container element resize events and hide/show columns as needed.
     * Resets pan position on container resize
     *
     * @memberof TableComponent
     */
    @action
    debouncedRender() {
        if (this.constrainColumnsToFit && this.resizeWidthSensitive) {
            scheduleOnce('afterRender', this, 'updateColumnVisibility');
        }
    }

    /**
     * Manually update the pan position if the calling component tells us to
     *
     * @memberof TableComponent
     */
    @action
    updatePanPosition() {
        this.columnPanPosition = this.args.columnPanPosition ?? 0;
        this.debouncedRender();
    }

    /**
     * Hides and shows table columns depending on the available container width
     *
     * @memberof TableComponent
     */
    updateColumnVisibility() {
        const columns = this.args.columns || A();
        const visibleColumns: NativeArray<ColumnValue> = A();
        const containerWidth = this.getElementWidth(this.containerElement);
        const allowFixedCols = containerWidth >= this.minFixedColTableWidth;
        const panPosition = this.columnPanPosition;
        let newTableWidth = 0;

        for (const [i, col] of columns.entries()) {
            const colIndex = allowFixedCols ? this.nonFixedColumns.indexOf(col) : i;
            if ((col && col.isFixedLeft && allowFixedCols) || colIndex >= panPosition) {
                const colWidth = col.staticWidth || 0;
                const isVisible = (col.isFixedLeft && allowFixedCols) || newTableWidth + colWidth <= containerWidth;
                if (isVisible) {
                    newTableWidth += colWidth;
                    visibleColumns.pushObject(col);
                    const isMobile = this.args.isMobile;
                    if (isMobile && visibleColumns.length === 2) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        this.visibleColumns = visibleColumns;
        this.containerWidth = containerWidth;
    }

    /**
     * Pans the table's visible column to the left or right the provided number of columns
     * e.g. `-1` pans one column to the left, `2` pans two columns to the right
     *
     * @param {number} moveIndex -- A number indicating the number of columns to pan
     * @memberof TableComponent
     */
    private panColumns(moveIndex: number) {
        const newColumnPanPosition = this.columnPanPosition + moveIndex;
        const pannedColumns = this.allowFixedCols ? this.nonFixedColumns : this.args.columns;
        if (newColumnPanPosition < 0 || newColumnPanPosition >= pannedColumns.length) {
            return;
        }

        this.columnPanPosition = newColumnPanPosition;
        this.updateColumnVisibility();
    }

    /**
     * Returns the computed width for the given element
     *
     * @param {Element} el -- A DOM element
     * @returns {number}
     * @memberof TableComponent
     */
    private getElementWidth(el: HTMLElement | null): number {
        if (!el) {
            return 0;
        }
        let width = 0;

        if (el) {
            const rects = el.getClientRects();
            const paddingLeft = parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left'));
            const paddingRight = parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            if (rects) {
                width = paddingLeft && paddingRight ? rects[0].width - (paddingLeft + paddingRight) : rects[0].width;
            }
        }

        return width;
    }

    /**
     * Returns the column's unique identifier or undefined.
     * Allow columns to specify an "id" if they dont have a valuePath, or the valuePath is not unique
     *
     * @param {(ColumnValue | undefined)} col - A table column
     * @returns {(string | undefined)}
     * @memberof TableComponent
     */
    getColumnId(col?: ColumnValue): string | undefined {
        return col && (col.id || col.valuePath);
    }

    //actions

    /**
     * Invokes an action to load a new page of rows when the first row in the table is reached/in view
     *
     * @returns {Promise | void}
     * @memberof TableComponent
     */
    @action
    onFirstReached() {
        if (!this.isLoading && this.hasMoreRows && this.args.loadPreviousRows) {
            return this.args.loadPreviousRows();
        }
        return;
    }

    /**
     * Invokes an action to load a new page of rows when the last row in the table is reached/in view
     *
     * @returns {Promise | void}
     * @memberof TableComponent
     */
    @action
    onLastReached() {
        if (!this.isLoading && this.hasMoreRows && this.args.loadMoreRows) {
            return this.args.loadMoreRows();
        }
        return;
    }

    /**
     * Pans the table's visible columns to the left
     *
     * @returns {void}
     * @memberof TableComponent
     */
    @action
    panColumnsLeft() {
        return this.panColumns(-1);
    }

    /**
     * Pans the table's visible columns to the right
     *
     * @returns {void}
     * @memberof TableComponent
     */
    @action
    panColumnsRight() {
        return this.panColumns(1);
    }

    /**
     * Updates the table's column sorting
     *
     * @param {any[]} sorts
     * @returns {Promise}
     * @memberof TableComponent
     */
    @action
    onUpdateSorts(sorts: TableSort[]) {
        if (this.args.onUpdateSorts) {
            this.args.onUpdateSorts(sorts);
        }
    }
}

export default TableComponent;
