import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { scheduleOnce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import { SafeString } from '@ember/template/-private/handlebars';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { ComponentLike } from '@glint/template';

import { FillMode, ResizeMode, SelectionMode, WidthConstraint } from '../../constants/table';
import { argDefault } from '../../decorators/table';

import type { EmberTableBodySignature } from '@gavant/glint-template-types/types/ember-table/body';
import type { EmberTableHeaderSignature } from '@gavant/glint-template-types/types/ember-table/header';

import type { Column as EmberTableColumn } from '@gavant/glint-template-types/types/ember-table/table';

type FooterCellComponent = ComponentLike<{
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

export interface Column extends EmberTableColumn {
    id?: string;
    isFixedLeft?: boolean;
    staticWidth: number;
    headerClassNames?: string;
    cellClassNames?: string;
    footerClassNames?: string;
    subcolumns?: Column[];
    footerComponent?: FooterCellComponent;
}

export interface TableSort {
    valuePath: string;
    isAscending: boolean;
}

export type TableMeta<M> = { [P in keyof M]: M[P] };

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

export interface RowClickEvent<R, TM> {
    event: MouseEvent;
    rowValue: R;
    rowMeta: RowMeta<R>;
    tableMeta?: TableMeta<TM>;
}

export type BodyArgs<R, TM> = Exclude<EmberTableBodySignature['Args'], 'api'> & {
    rows: R[];
    selection?: R[] | R | null;
    tableMeta?: TableMeta<TM>;
};

export type HeadArgs<TM> = Exclude<EmberTableHeaderSignature['Args'], 'api'> & {
    tableMeta?: TableMeta<TM>;
};

export interface TableArgs<R, F, TM> extends BodyArgs<R, TM>, HeadArgs<TM> {
    columns: Column[];
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
    onVisibleColumnsChange?: (columns: Column[]) => void;

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
     * On click of cell
     *
     * @memberof TableArgs
     */
    onCellClick?: ((rowClickEvent: RowClickEvent<R, TM>) => void) | undefined;

    /**
     * On double click of cell
     *
     * @memberof TableArgs
     */
    onCellDoubleClick?: ((rowClickEvent: RowClickEvent<R, TM>) => void) | undefined;

    /**
     * Event to handle click on row
     *
     * @memberof TableArgs
     */
    onRowClick?: (rowClickEvent: RowClickEvent<R, TM>) => void;

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
    footerRows?: NativeArray<F> | F[];

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

interface TableSignature<R, F, TM> {
    Args: TableArgs<R, F, TM>;
    Element: HTMLDivElement;
}

export default class TableComponent<R, F, TM> extends Component<TableSignature<R, F, TM>> {
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

    get nonBreakingSpace() {
        return htmlSafe('&nbsp;');
    }

    @argDefault bufferSize: number = 0;
    @argDefault containerSelector: string = 'body';
    @argDefault constrainColumnsToFit: boolean = true;
    @argDefault enableReorder: boolean = false;
    @argDefault enableSort: boolean = false;
    @argDefault enableUserResize: boolean = false;
    @argDefault estimateRowHeight: number = 30;
    @argDefault fillColumnIndex: number | null = null;
    @argDefault fillMode: FillMode = FillMode.FIRST;
    @argDefault footerRows: Array<F> = [];
    @argDefault hasMoreRows: boolean = false;
    @argDefault hoverableRows: boolean = true;
    @argDefault isLoading: boolean = false;
    @argDefault noResultsText: string = 'No results found';
    @argDefault panButtonClass: string = 'btn btn-secondary';
    @argDefault renderAll: boolean = false;
    @argDefault resizeDebounce: number = 250;
    @argDefault resizeMode: ResizeMode = ResizeMode.STANDARD;
    @argDefault resizeWidthSensitive: boolean = true;
    @argDefault rowComponent: string = 'ember-tr';
    @argDefault showEmptyFooter: boolean = false;
    @argDefault showHeader: boolean = true;
    @argDefault small: boolean = false;
    @argDefault sortEmptyLast: boolean = false;
    @argDefault stripedRows: boolean = false;
    @argDefault tableClass: string = 'table';
    @argDefault tableHeight: string | number = '';
    @argDefault widthConstraint: WidthConstraint = WidthConstraint.LESS_THAN;
    @argDefault headerStickyOffset: number = 0;
    @argDefault footerStickyOffset: number = 0;
    @argDefault sorts: TableSort[] = [];
    @argDefault key: string = '@identity';
    @argDefault isMobile: boolean = false;

    //component state
    @tracked columnPanPosition: number = this.args.columnPanPosition ?? 0;
    @tracked containerWidth: number | null = null;
    @tracked visibleColumns: NativeArray<Column> = A([]);
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

    get checkboxSelectionMode() {
        return this.args.checkboxSelectionMode ?? SelectionMode.SINGLE;
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
    get firstVisibleNonFixedColumn(): Column | undefined {
        return this.visibleColumns && this.visibleColumns.find((col) => !col.isFixedLeft);
    }

    /**
     * Returns the array of fixed columns.
     *
     * @readonly
     * @type {NativeArray<ColumnValue>}
     */
    get fixedColumns() {
        return A((this.args.columns || A()).filter((col) => col.isFixedLeft));
    }

    /**
     * Returns the array of non-fixed columns.
     *
     * @readonly
     * @type {NativeArray<ColumnValue>}
     */
    get nonFixedColumns() {
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
        this.visibleColumns = A(this.args.columns);
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
            scheduleOnce('afterRender', this, this.updateColumnVisibility);
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
            scheduleOnce('afterRender', this, this.updateColumnVisibility);
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
        const visibleColumns = A<Column>([]);
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

        this.args.onVisibleColumnsChange?.(visibleColumns.toArray());
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
    getColumnId(col?: Column): string | undefined {
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
