import Component from '@ember/component';
import { or, empty, not, and, gt, readOnly } from '@ember/object/computed';
import { set, computed, get, setProperties, action } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { A } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import { SafeString } from '@ember/template/-private/handlebars';
import { lt, gte, conditional } from 'ember-awesome-macros';
import ResizeAware from 'ember-resize/mixins/resize-aware';
import Media from 'ember-responsive';
import { observes } from '@ember-decorators/object';
import NativeArray from '@ember/array/-private/native-array';
// @ts-ignore: Ignore import of compiled template
import layout from '../templates/components/table';
import { TableColumn, TableSort } from '@gavant/ember-table';

class TableComponent extends Component.extend({ ResizeAware }) {
    @service media!: Media;
    layout = layout;
    classNames: string[] = ['data-table'];
    classNameBindings: string[] = ['isServerRendered', 'hasHiddenColumns', 'isColumnsPanned'];
    resizeWidthSensitive: boolean = true;
    //configuration options
    showHeader: boolean = true;
    noResultsText: string | null = 'No results found';
    tableClass: string = 'table';
    stripedRows: boolean = false;
    hoverableRows: boolean = true;
    small: boolean = true;
    tableHeight: string = '';
    enableUserResize: boolean = false;
    loadMoreRows?: () => Promise<any[]>;
    protected updateSorts?: (sorts: TableSort[]) => void;
    sortEmptyLast: boolean = false;
    //ember-table's resizing must be enabled in order for fill-mode auto column
    //resizing to work, even if you don't want to allow user-invoked resizing
    enableResize: boolean = true;
    enableReorder: boolean = false;
    enableSort: boolean = false;
    sortFunction?: (
        itemA: TableColumn,
        itemB: TableColumn,
        sorts: TableSort[],
        compare: <T>(valueA: T, valueB: T, sortEmptyLast: boolean) => number,
        sortEmptyLast: boolean
    ) => number;
    compareFunction?: <T>(valueA: T, valueB: T, sortEmptyLast: boolean) => number;
    //the selector used by <VerticalCollection> to calculate occulsion rendering
    //set this to `null` for fixed height/scrollable tables
    containerSelector: string = this.elementId;
    widthConstraint: string = 'lte-container';
    fillMode: string = 'first-column';
    fillColumnIndex: number | null = null;
    resizeMode: string = 'standard';
    bufferSize: number = 0;
    estimateRowHeight: number = 30;
    renderAllRows: boolean = false;
    constrainColumnsToFit: boolean = true;
    showEmptyFooter: boolean = false;

    //component state
    columns: NativeArray<TableColumn> = A();
    visibleColumns: NativeArray<TableColumn> = A();
    columnPanPosition: number = 0;
    rows: any[] = [];
    sorts: TableSort[] = [];
    isLoading: boolean = false;
    hasMoreRows: boolean = false;
    hasHiddenOverflow: boolean = false;
    containerWidth: number | null = null;

    //readonly attributes

    /**
     * CP that returns the default no-results text
     *
     * @type {string} defaultNoResultsText
     * @memberof TableComponent
     */
    @readOnly('noResultsText') defaultNoResultsText!: string;

    /**
     * CP that returns whether the table rows are clickable
     *
     * @type {boolean} clickableRows
     * @memberof TableComponent
     */
    @or('onRowClick', 'onRowDoubleClick') clickableRows!: boolean;

    /**
     * CP that returns whether the table is empty
     *
     * @type {boolean} noRows
     * @memberof TableComponent
     */
    @empty('rows') noRows!: boolean;

    /**
     * CP that returns whether the table is NOT loading
     *
     * @type {boolean} notLoading
     * @memberof TableComponent
     */
    @not('isLoading') notLoading!: boolean;

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
    @lt('visibleColumns.length', 'columns.length') hasHiddenColumns!: boolean;

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
     * @type {TableColumn} firstVisibleColumn
     * @memberof TableComponent
     */
    @conditional('allowFixedCols', 'firstVisibleNonFixedColumn', 'visibleColumns.firstObject')
    firstVisibleColumn!: TableColumn;

    /**
     * CP that returns the first visible non-fixed column
     *
     * @readonly
     * @type {(TableColumn | undefined)} firstVisibleNonFixedColumn
     * @memberof TableComponent
     */
    @computed('visibleColumns.@each.isFixedLeft')
    get firstVisibleNonFixedColumn(): TableColumn | undefined {
        return this.visibleColumns && this.visibleColumns.find((col) => !col.isFixedLeft);
    }

    /**
     * CP that returns the array of fixed columns
     *
     * @readonly
     * @type {NativeArray<TableColumn>} fixedColumns
     * @memberof TableComponent
     */
    @computed('columns.@each.isFixedLeft')
    get fixedColumns(): NativeArray<TableColumn> {
        return A((this.columns || A()).filter((col) => col.isFixedLeft));
    }

    /**
     * CP that returns the array of non-fixed columns
     *
     * @readonly
     * @type {NativeArray<TableColumn>}
     * @memberof TableComponent
     */
    @computed('columns.@each.isFixedLeft')
    get nonFixedColumns(): NativeArray<TableColumn> {
        return A((this.columns || A()).filter((col) => !col.isFixedLeft));
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
            const sortedColumns = get(this, 'nonFixedColumns').sortBy('staticWidth');
            const widestColumn = get(sortedColumns, 'lastObject');
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
        const lastColId = this.getColumnId(get(get(this, 'columns'), 'lastObject'));
        const visibleColId = this.getColumnId(get(get(this, 'visibleColumns'), 'lastObject'));
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
        const firstColId = this.getColumnId(get(get(this, 'columns'), 'firstObject'));
        const nonFixedColId = this.getColumnId(get(get(this, 'nonFixedColumns'), 'firstObject'));
        const colId = this.allowFixedCols ? nonFixedColId : firstColId;
        const visibleColId = this.getColumnId(this.firstVisibleColumn);
        return this.hasHiddenColumns && Boolean(colId && visibleColId) && colId !== visibleColId;
    }

    /**
     * CP that returns a unique data-table ID
     *
     * @readonly
     * @type {string} tableId
     * @memberof TableComponent
     */
    @computed('elementId')
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

    /**
     * CP that returns a class string that includes all of
     * the enabled properties
     *
     * @readonly
     * @type {string} tableClassNames
     * @memberof TableComponent
     */
    @computed('tableClass', 'showHeader', 'stripedRows', 'hoverableRows', 'clickableRows', 'small')
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

    /**
     * Updates the visible columns when the source columns array changes
     *
     * @readonly
     * @type {Object}
     * @memberof TableComponent
     */
    @observes('columns.[]')
    onColumnsChange(): Object {
        return scheduleOnce('afterRender', this, 'updateColumnVisibility');
    }

    //methods

    /**
     * Initialize the table component's `visibleColumns`
     *
     * @memberof TableComponent
     */
    init() {
        super.init();
        this.columns.setEach('isVisible', true); // ETWA
        // set(this, 'visibleColumns', this.columns); // pre-ETWA
    }

    /**
     * Handles initial column visibility manipulation when the table is first rendered
     *
     * @memberof TableComponent
     */
    didInsertElement() {
        super.didInsertElement();
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
    debouncedDidResize() {
        if (this.constrainColumnsToFit) {
            //TODO maybe eventually improve this to maintain pan position
            //and dynamically show/hide as needed?
            set(this, 'columnPanPosition', 0);
            scheduleOnce('afterRender', this, 'updateColumnVisibility');
        }
    }

    /**
     * Hides and shows table columns depending on the available container width
     *
     * @memberof TableComponent
     */
    updateColumnVisibility() {
        const columns = this.columns || A();
        const visibleColumns: NativeArray<TableColumn> = A();
        const containerWidth = this.getElementWidth(this.element);
        const allowFixedCols = containerWidth >= this.minFixedColTableWidth;
        const panPosition = this.columnPanPosition;
        let newTableWidth = 0;
        let hasAllVisibleColumns = false; //ETWA

        for (const [i, col] of columns.entries()) {
            let colIndex = allowFixedCols ? this.nonFixedColumns.indexOf(col) : i;
            if ((col && col.isFixedLeft && allowFixedCols) || colIndex >= panPosition) {
                let colWidth = col.staticWidth || 0;
                let isVisible = (col.isFixedLeft && allowFixedCols) || newTableWidth + colWidth <= containerWidth;
                if (isVisible && !hasAllVisibleColumns) {
                    //^ETWA (&& !arrayComplete)
                    newTableWidth += colWidth;
                    set(col, 'isVisible', true); //ETWA
                    set(col, 'width', colWidth); //ETWA
                    visibleColumns.pushObject(col);
                    // Prevent unwanted panning behavior on mobile that occurs with more than 2 columns
                    const isMobile = get(get(this, 'media'), 'isMobile');
                    if (isMobile && visibleColumns.length === 2) {
                        hasAllVisibleColumns = true; //ETWA
                        // break; pre-ETWA
                    }
                } else {
                    set(col, 'isVisible', false); //ETWA
                    set(col, 'width', 0); //ETWA
                    // break; pre-ETWA
                }
            } else {
                set(col, 'isVisible', false); //ETWA
                set(col, 'width', 0); //ETWA
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
        const pannedColumns = this.allowFixedCols ? this.nonFixedColumns : this.columns;
        if (newColumnPanPosition < 0 || newColumnPanPosition >= pannedColumns.length) {
            return;
        }

        set(this, 'columnPanPosition', newColumnPanPosition);
        this.updateColumnVisibility();
    }

    /**
     * Returns the computed width for the given element
     *
     * @param {Element} el -- A DOM element
     * @returns {number}
     * @memberof TableComponent
     */
    private getElementWidth(el: Element): number {
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
     * @param {(TableColumn | undefined)} col - A table column
     * @returns {(string | undefined)}
     * @memberof TableComponent
     */
    getColumnId(col?: TableColumn): string | undefined {
        return col && (col.id || col.valuePath);
    }

    //actions

    /**
     * Invokes an action to load a new page of rows
     *
     * @returns {Promise}
     * @memberof TableComponent
     */
    @action
    onLastReached() {
        if (!this.isLoading && this.hasMoreRows && this.loadMoreRows) {
            this.loadMoreRows();
        }
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
        set(this, 'sorts', sorts);
        if (this.updateSorts) {
            this.updateSorts(sorts);
        }
    }
}

export default TableComponent;
