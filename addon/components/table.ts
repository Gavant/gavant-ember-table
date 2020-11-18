import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';
import { assert } from '@ember/debug';
import { action, set } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { SafeString } from '@ember/template/-private/handlebars';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { argDefault } from '@gavant/ember-table/decorators/table';
import Media from 'ember-responsive';

export interface ColumnValue {
    [index: string]: any;
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

export interface ColumnMeta {
    [index: string]: any;
    //attributes
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
    [index: string]: any;
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

export interface RowClickEvent<T> {
    event: MouseEvent;
    rowValue: T;
    rowMeta: RowMeta<T>;
    tableMeta?: TableMeta;
}

export interface TableAPI<T> {
    cells: TableCell<T>[];
    rowMeta: RowMeta<T>;
    rowSelectionMode: string;
    rowValue: T;
    isHeader: boolean;
}

export interface TableCell<T> {
    checkboxSelectionMode: string;
    columnMeta: ColumnMeta;
    columnValue: ColumnValue;
    rowMeta: RowMeta<T>;
    rowSelectionMode: string;
    rowValue: T;
    cellValue: any;
}

export interface TableMeta {
    [index: string]: any;
}

export interface TableArgs {
    [index: string]: any;

    //booleans
    constrainColumnsToFit: boolean;
    hoverableRows?: boolean;
    enableReorder?: boolean;
    enableSort?: boolean;
    enableUserResize?: boolean;
    renderAllRows: boolean;
    resizeWidthSensitive: boolean;
    stripedRows?: boolean;
    showEmptyFooter: boolean;
    showHeader?: boolean;
    small?: boolean;
    sortEmptyLast?: boolean;

    //attributes
    bufferSize: number;
    columns: NativeArray<ColumnValue>;
    containerSelector?: string;
    estimateRowHeight: number;
    fillColumnIndex?: number | null;
    fillMode?: string;
    footerRows?: NativeArray<{
        [valuePath: string]: any;
    }>;
    noResultsText?: string;
    panButtonClass?: string;
    resizeDebounce?: number;
    resizeMode?: string;
    rows: NativeArray<any>;
    tableClass?: string;
    tableHeight?: string;
    widthConstraint?: string;
    headerStickyOffset?: number;
    footerStickyOffset?: number;

    //methods
    loadPreviousRows?: () => Promise<any[]>;
    loadMoreRows?: () => Promise<any[]>;
    updateSorts?: (sorts: TableSort[]) => void;
    onRowClick?: <T>(rowClickEvent: RowClickEvent<T>) => any;
    onRowDoubleClick?: () => any;
    /**
     * An action that is triggered when @sorts is updated.
     *
     */
    onHeaderAction?: () => any;
    /**
     * An action that is triggered when @columns are reordered.
     *
     */
    onReorder?: () => any;
    /**
     * An action that is triggered when columns are resized.
     *
     */
    onResize?: () => any;
    sortFunction?: (
        itemA: ColumnValue,
        itemB: ColumnValue,
        sorts: TableSort[],
        compare: <T>(valueA: T, valueB: T, sortEmptyLast: boolean) => number,
        sortEmptyLast: boolean
    ) => number;
    compareFunction?: <T>(valueA: T, valueB: T, sortEmptyLast: boolean) => number;
}

class TableComponent extends Component<TableArgs> {
    @service media!: Media;

    //readonly attributes

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
        return htmlSafe(this.tableHeight ? `height: ${this.tableHeight};` : '');
    }

    //configuration options

    @argDefault bufferSize: number = 0;
    //the selector used by <VerticalCollection> to calculate occulsion rendering
    //set this to `null` for fixed height/scrollable tables
    @argDefault containerSelector: string = 'body';
    @argDefault constrainColumnsToFit: boolean = true;
    @argDefault enableReorder: boolean = false;
    @argDefault enableSort: boolean = false;
    @argDefault enableUserResize: boolean = false;
    @argDefault estimateRowHeight: number = 30;
    @argDefault fillColumnIndex: number | null = null;
    @argDefault fillMode: string = 'first-column';
    @argDefault footerRows: Array<any> = [];
    @argDefault hasMoreRows: boolean = false;
    @argDefault hoverableRows: boolean = true;
    @argDefault isLoading: boolean = false;
    @argDefault noResultsText: string = 'No results found';
    @argDefault panButtonClass: string = 'btn btn-secondary';
    @argDefault renderAllRows: boolean = false;
    @argDefault resizeDebounce: number = 250;
    @argDefault resizeMode: string = 'standard';
    @argDefault resizeWidthSensitive: boolean = true;
    @argDefault rowComponent: string = 'ember-tr';
    @argDefault showEmptyFooter: boolean = false;
    @argDefault showHeader: boolean = true;
    @argDefault small: boolean = true;
    @argDefault sortEmptyLast: boolean = false;
    @argDefault stripedRows: boolean = false;
    @argDefault tableClass: string = 'table';
    @argDefault tableHeight: string = '';
    @argDefault widthConstraint: string = 'lte-container';
    @argDefault headerStickyOffset: number = 0;
    @argDefault footerStickyOffset: number = 0;
    @argDefault sorts: TableSort[] = [];

    //component state
    @tracked columnPanPosition: number = 0;
    @tracked containerWidth: number | null = null;
    @tracked hasHiddenOverflow: boolean = false;
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
        return (this.containerWidth || 0) >= this.minFixedColTableWidth;
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
    constructor(owner: unknown, args: TableArgs) {
        super(owner, args);
        assert('@rows is not an instanceof Array.', args.rows instanceof Array);
        assert('@columns is not an instanceof Array', args.columns instanceof Array);
        // this.visibleColumns = this.args.columns; // pre-ETWA
        this.args.columns.forEach((col) => {
            // ETWA
            set(col, 'isVisible', true);
            if (col.subcolumns) {
                col.subcolumns.forEach((subColumn) => {
                    set(subColumn, 'isVisible', true);
                });
            }
        });
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
            //TODO maybe eventually improve this to maintain pan position
            //and dynamically show/hide as needed?
            this.columnPanPosition = 0;
            scheduleOnce('afterRender', this, 'updateColumnVisibility');
        }
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
        let hasAllVisibleColumns = false; // ETWA

        for (const [i, col] of columns.entries()) {
            let colIndex = allowFixedCols ? this.nonFixedColumns.indexOf(col) : i;
            if ((col && col.isFixedLeft && allowFixedCols) || colIndex >= panPosition) {
                let colWidth = col.staticWidth || 0;
                let isVisible = (col.isFixedLeft && allowFixedCols) || newTableWidth + colWidth <= containerWidth;
                if (isVisible && !hasAllVisibleColumns && (i === 0 || columns[i - 1]?.isVisible)) {
                    newTableWidth += colWidth;
                    set(col, 'isVisible', true); // ETWA
                    set(col, 'width', colWidth); // ETWA
                    visibleColumns.pushObject(col);
                    // Prevent unwanted panning behavior on mobile that occurs with more than 2 columns
                    const isMobile = this.media.isMobile;
                    if (isMobile && visibleColumns.length === 2) {
                        hasAllVisibleColumns = true; // ETWA
                        // break; // pre-ETWA
                    }
                } else {
                    set(col, 'isVisible', false); // ETWA
                    set(col, 'width', 0); // ETWA
                    // break; // pre-ETWA
                }
            } else {
                set(col, 'isVisible', false); // ETWA
                set(col, 'width', 0); // ETWA
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
            let rects = el.getClientRects();
            let paddingLeft = parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left'));
            let paddingRight = parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
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
        if (this.args.updateSorts) {
            this.args.updateSorts(sorts);
        }
    }
}

export default TableComponent;
