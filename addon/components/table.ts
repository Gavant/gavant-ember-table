import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { or, and, gt } from '@ember/object/computed';
import { computed, setProperties, action } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import { SafeString } from '@ember/template/-private/handlebars';
import { lt, gte, conditional } from 'ember-awesome-macros';
import Media from 'ember-responsive';
import NativeArray from '@ember/array/-private/native-array';
import { ColumnValue, TableSort, RowClickEvent } from '@gavant/ember-table';
import { argDefault } from '@gavant/ember-table/decorators/table';

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

    //methods
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
     * CP that returns a unique data-table ID
     *
     * @readonly
     * @type {string} tableId
     * @memberof TableComponent
     */
    get tableId(): string {
        return `data-table-${this.elementId}`;
    }

    /**
     * CP that returns a CSS style for the table height
     *
     *
     * @readonly
     * @type {string} height
     * @memberof TableComponent
     */
    @computed('tableHeight')
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
    @argDefault showEmptyFooter: boolean = false;
    @argDefault showHeader: boolean = true;
    @argDefault small: boolean = true;
    @argDefault sortEmptyLast: boolean = false;
    @argDefault stripedRows: boolean = false;
    @argDefault tableClass: string = 'table';
    @argDefault tableHeight: string = '';
    @argDefault widthConstraint: string = 'lte-container';

    //component state
    @tracked columnPanPosition: number = 0;
    @tracked containerWidth: number | null = null;
    @tracked hasHiddenOverflow: boolean = false;
    @tracked sorts: TableSort[] = [];
    @tracked visibleColumns: NativeArray<ColumnValue> = A();
    @tracked containerElement: HTMLElement | null = null;

    get noRows(): boolean {
        return this.args.rows.length === 0;
    }

    get notLoading(): boolean {
        return !this.isLoading;
    }

    /**
     * CP that returns whether the table rows are clickable
     *
     * @type {boolean} clickableRows
     * @memberof TableComponent
     */
    @or('onRowClick', 'onRowDoubleClick') clickableRows!: boolean;

    /**
     * CP that returns whether a fully-loaded table is empty
     *
     * @type {boolean} isEmpty
     * @memberof TableComponent
     */
    @and('noRows', 'notLoading') isEmpty!: boolean;

    /**
     * CP that returns whether there are non-rendered columns
     *
     * @type {boolean} hasHiddenColumns
     * @memberof TableComponent
     */
    @lt('visibleColumns.length', 'args.columns.length') hasHiddenColumns!: boolean;

    /**
     * CP that returns whether the table is currently panned
     *
     * @type {boolean} isColumnsPanned
     * @memberof TableComponent
     */
    @gt('columnPanPosition', 0) isColumnsPanned!: boolean;

    /**
     * CP that returns true when `containerWidth` >= `minFixedColTableWidth`
     *
     * @type {boolean} allowFixedCols
     * @memberof TableComponent
     */
    @gte('containerWidth', 'minFixedColTableWidth') allowFixedCols!: boolean;

    /**
     * CP that returns which column should be used as the first
     * visible column
     *
     * @type {ColumnValue} firstVisibleColumn
     * @memberof TableComponent
     */
    @conditional('allowFixedCols', 'firstVisibleNonFixedColumn', 'visibleColumns.firstObject')
    firstVisibleColumn!: ColumnValue;

    /**
     * CP that returns the first visible non-fixed column
     *
     * @readonly
     * @type {(ColumnValue | undefined)} firstVisibleNonFixedColumn
     * @memberof TableComponent
     */
    @computed('visibleColumns.@each.isFixedLeft')
    get firstVisibleNonFixedColumn(): ColumnValue | undefined {
        return this.visibleColumns && this.visibleColumns.find((col) => !col.isFixedLeft);
    }

    /**
     * CP that returns the array of fixed columns
     *
     * @readonly
     * @type {NativeArray<ColumnValue>} fixedColumns
     * @memberof TableComponent
     */

    get fixedColumns(): NativeArray<ColumnValue> {
        return A((this.args.columns || A()).filter((col) => col.isFixedLeft));
    }

    get nonFixedColumns(): NativeArray<ColumnValue> {
        return A((this.args.columns || A()).filter((col) => !col.isFixedLeft));
    }

    /**
     * CP that determines the minimum table width when
     * fixed columns are present, else returns 0
     *
     * @readonly
     * @type {number} minFixedColTableWidth
     * @memberof TableComponent
     */
    @computed('fixedColumns.@each.width', 'nonFixedColumns.@each.width')
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
     * CP that returns the table's current ability to pan right.
     * Columns can be panned right if there are hidden columns
     * and the last visible column is not the last defined column
     *
     * @readonly
     * @type {boolean} canPanRight
     * @memberof TableComponent
     */
    @computed('hasHiddenColumns', 'columns.lastObject.{id,valuePath}', 'visibleColumns.lastObject.{id,valuePath}')
    get canPanRight(): boolean {
        const lastColId = this.getColumnId(this.args.columns[this.args.columns.length - 1]);
        const visibleColId = this.getColumnId(this.visibleColumns[this.visibleColumns.length - 1]);
        return this.hasHiddenColumns && Boolean(lastColId && visibleColId) && lastColId !== visibleColId;
    }

    /**
     * CP that returns the table's ability to pan left.
     * Columns can be panned left if there are hidden columns
     * and the first visible column (first NON-FIXED visible column, if fixed columns are enabled)
     * is not the first defined column
     *
     * @readonly
     * @type {boolean} canPanLeft
     * @memberof TableComponent
     */
    @computed(
        'hasHiddenColumns',
        'allowFixedCols',
        'columns.firstObject.{id,valuePath}',
        'nonFixedColumns.firstObject.{id,valuePath}',
        'firstVisibleColumn.{id,valuePath}'
    )
    get canPanLeft(): boolean {
        const firstColId = this.getColumnId(this.args.columns[0]);
        const nonFixedColId = this.getColumnId(this.nonFixedColumns[0]);
        const colId = this.allowFixedCols ? nonFixedColId : firstColId;
        const visibleColId = this.getColumnId(this.firstVisibleColumn);
        return this.hasHiddenColumns && Boolean(colId && visibleColId) && colId !== visibleColId;
    }

    /**
     * CP that returns a class string that includes all of
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
     * CP that returns a new fillColumnIndex when the current
     * fillColumnIndex is out of range
     *
     * @readonly
     * @type {(number | null)} adjustedFillColumnIndex
     * @memberof TableComponent
     */
    @computed('fillColumnIndex', 'visibleColumns.length')
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
        assert(
            'Property staticWidth is missing on one or more column objects',
            args.columns.every((col) => {
                return !!col.staticWidth || col.staticWidth === 0;
            })
        );
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

        for (const [i, col] of columns.entries()) {
            let colIndex = allowFixedCols ? this.nonFixedColumns.indexOf(col) : i;
            if ((col && col.isFixedLeft && allowFixedCols) || colIndex >= panPosition) {
                let colWidth = col.staticWidth || 0;
                let isVisible = (col.isFixedLeft && allowFixedCols) || newTableWidth + colWidth <= containerWidth;
                if (isVisible) {
                    newTableWidth += colWidth;
                    visibleColumns.pushObject(col);
                    // Prevent unwanted panning behavior on mobile that occurs with more than 2 columns
                    const isMobile = this.media.isMobile;
                    if (isMobile && visibleColumns.length === 2) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        setProperties(this, { containerWidth, visibleColumns });
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
     * Invokes an action to load a new page of rows
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
        this.sorts = sorts;
        if (this.args.updateSorts) {
            this.args.updateSorts(sorts);
        }
    }
}

export default TableComponent;
