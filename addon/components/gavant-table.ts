import Component from '@ember/component';
import { or, empty, not, and, gt } from '@ember/object/computed';
import { set, computed, get, setProperties, action } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { A } from '@ember/array';
import { tryInvoke, isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import NativeArray from '@ember/array/-private/native-array';
import { lt, gte, conditional } from 'ember-awesome-macros';
import { t } from 'ember-intl';
import ResizeAware from 'ember-resize/mixins/resize-aware';
// @ts-ignore: Ignore import of compiled template
import layout from '../templates/components/gavant-table';
import { TableColumn } from 'ember-table';
import { SafeString } from '@ember/template/-private/handlebars';
import Media from 'ember-responsive';

class GavantTableComponent extends Component.extend({ ResizeAware }) {
    @service media!: Media;
    //configuration options
    layout = layout;
    classNames: string[] = ['data-table'];
    showHeader: boolean = false;
    noResultsText: string | null = null;
    tableClass: string = 'table';
    stripedRows: boolean = false;
    hoverableRows: boolean = true;
    small: boolean = true;
    tableHeight: string = '';
    enableUserResize: boolean = false;
    //ember-table's resizing must be enabled in order for fill-mode auto column
    //resizing to work, even if you don't want to allow user-invoked resizing
    enableResize: boolean = true;
    enableReorder: boolean = false;
    enableSort: boolean = false;
    sortFunction: any = null;
    //the selector used by <VerticalCollection> to calculate occulsion rendering
    //set this to `null` for fixed height/scrollable tables
    containerSelect: string = '#bm-content';
    widthConstraint: string = 'eq-container';
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
    rows: Object[] = [];
    sorts: Object[] = [];
    isLoading: boolean = false;
    hasMoreRows: boolean = false;
    hasHiddenOverflow: boolean = false;
    containerWidth: number | null = null;

    //readonly attributes

    /**
     * TODO
     *
     * @type {string} defaultNoResultsText
     * @memberof GavantTableComponent
     */
    @t('tables.noResults') defaultNoResultsText!: string;

    /**
     * CP that returns whether the table rows are clickable
     *
     * @type {boolean} clickableRows
     * @memberof GavantTableComponent
     */
    @or('onRowClick', 'onRowDoubleClick') clickableRows!: boolean;

    /**
     * CP that returns whether the table is empty
     *
     * @type {boolean} noRows
     * @memberof GavantTableComponent
     */
    @empty('rows') noRows!: boolean;

    /**
     * CP that returns whether the table is NOT loading
     *
     * @type {boolean} notLoading
     * @memberof GavantTableComponent
     */
    @not('isLoading') notLoading!: boolean;

    /**
     * CP that returns whether a fully-loaded table is empty
     *
     * @type {boolean} isEmpty
     * @memberof GavantTableComponent
     */
    @and('noRows', 'notLoading') isEmpty!: boolean;

    /**
     * CP that returns whether there are non-rendered columns
     *
     * @type {boolean} hasHiddenColumns
     * @memberof GavantTableComponent
     */
    @lt('visibleColumns.length', 'columns.length') hasHiddenColumns!: boolean;

    /**
     * CP that returns whether the table is currently panned
     *
     * @type {boolean} isColumnsPanned
     * @memberof GavantTableComponent
     */
    @gt('columnPanPosition', 0) isColumnsPanned!: boolean;

    /**
     * CP that returns true when `containerWidth` >= `minFixedColTableWidth`
     *
     * @type {boolean} allowFixedCols
     * @memberof GavantTableComponent
     */
    @gte('containerWidth', 'minFixedColTableWidth') allowFixedCols!: boolean;

    /**
     * CP that returns which column should be used as the first
     * visible column
     *
     * @type {TableColumn} firstVisibleColumn
     * @memberof GavantTableComponent
     */
    @conditional('allowFixedCols', 'firstVisibleNonFixedColumn', 'visibleColumns.firstObject')
    firstVisibleColumn!: TableColumn;

    /**
     * CP that returns the first visible non-fixed column
     *
     * @readonly
     * @type {(TableColumn | undefined)} firstVisibleNonFixedColumn
     * @memberof GavantTableComponent
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
     * @memberof GavantTableComponent
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
     * @memberof GavantTableComponent
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
     * @memberof GavantTableComponent
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
     * CP that returns the table's current ability to pan right
     *
     * @readonly
     * @type {boolean} canPanRight
     * @memberof GavantTableComponent
     */
    @computed('hasHiddenColumns', 'columns.lastObject.{id,valuePath}', 'visibleColumns.lastObject.{id,valuePath}')
    get canPanRight(): boolean {
        //columns can be panned right if there is hidden columns
        //and the last visible column is not the last defined column
        const lastColId = this.getColumnId(this.columns.lastObject);
        const visibleColId = this.getColumnId(this.visibleColumns.lastObject);
        return this.hasHiddenColumns && Boolean(lastColId && visibleColId) && lastColId !== visibleColId;
    }

    /**
     * CP that returns the table's ability to pan left
     *
     * @readonly
     * @type {boolean} canPanLeft
     * @memberof GavantTableComponent
     */
    @computed(
        'hasHiddenColumns',
        'allowFixedCols',
        'columns.firstObject.{id,valuePath}',
        'nonFixedColumns.firstObject.{id,valuePath}',
        'firstVisibleColumn.{id,valuePath}'
    )
    get canPanLeft(): boolean {
        //columns can be panned left if there is hidden columns
        //and the first visible column (first NON-FIXED visible column, if fixed columns are enabled)
        //is not the first defined column
        const firstColId = this.getColumnId(this.columns.firstObject);
        const nonFixedColId = this.getColumnId(this.nonFixedColumns.firstObject);
        const colId = this.allowFixedCols ? nonFixedColId : firstColId;
        const visibleColId = this.getColumnId(this.firstVisibleColumn);
        return this.hasHiddenColumns && Boolean(colId && visibleColId) && colId !== visibleColId;
    }

    /**
     * CP that returns a unique data-table ID
     *
     * @readonly
     * @type {string} tableId
     * @memberof GavantTableComponent
     */
    @computed('elementId')
    get tableId(): string {
        return `data-table-${this.elementId}`;
    }

    /**
     * TODO
     *
     *
     * @readonly
     * @type {string} height
     * @memberof GavantTableComponent
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
     * @memberof GavantTableComponent
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
     * @memberof GavantTableComponent
     */
    @computed('fillColumnIndex', 'visibleColumns.length')
    get adjustedFillColumnIndex(): number | null {
        if (this.fillColumnIndex) {
            return this.fillColumnIndex > this.visibleColumns.length - 1 ? 0 : this.fillColumnIndex;
        } else {
            return this.fillColumnIndex;
        }
    }

    /**
     * Updates the visible columns when the source columns array changes
     * TODO - observer???
     * @readonly
     * @type {*} any
     * @memberof GavantTableComponent
     */
    @computed('columns.[]')
    get onColumnsChange(): any {
        return scheduleOnce('afterRender', this, 'updateColumnVisibility');
    }

    //methods

    /**
     * Initialize the table component's `visibleColumns`
     *
     * @memberof GavantTableComponent
     */
    init() {
        super.init();
        set(this, 'visibleColumns', this.columns);
    }

    /**
     * Handles initial column visibility manipulation when the table is first rendered
     *
     * @memberof GavantTableComponent
     */
    didInsertElement() {
        super.didInsertElement();
        if (this.constrainColumnsToFit) {
            scheduleOnce('afterRender', this, 'updateColumnVisibility');
        }
    }

    /**
     * Handle component container element resize events and hide/show columns as needed
     *
     * @memberof GavantTableComponent
     */
    debouncedDidResize() {
        if (this.constrainColumnsToFit) {
            //reset pan position on container resize
            //TODO maybe eventually improve this to maintain pan position
            //and dynamically show/hide as needed?
            set(this, 'columnPanPosition', 0);
            scheduleOnce('afterRender', this, 'updateColumnVisibility');
        }
    }

    /**
     * Hides and shows table columns depending on the available container width
     *
     * @memberof GavantTableComponent
     */
    updateColumnVisibility() {
        const columns = this.columns || A();
        const visibleColumns: NativeArray<TableColumn> = A();
        const containerWidth = this.getElementWidth(this.element);
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
                    // Prevent unwanted panning behaviour on mobile that occurs with more than 2 columns
                    const isMobile = get(get(this, 'media'), 'isMobile');
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
     * @param {number} moveIndex
     * @memberof GavantTableComponent
     */
    panColumns(moveIndex: number) {
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
     * @param {Element} el
     * @returns {number}
     * @memberof GavantTableComponent
     */
    getElementWidth(el: Element): number {
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
     * Returns the column's unique identifier
     *
     * @param {TableColumn} col
     * @returns {string}
     * @memberof GavantTableComponent
     */
    getColumnId(col: TableColumn): string {
        //allow columns to specify an "id" if they dont have a valuePath, or the valuePath is not unique
        return col && (col.id || col.valuePath);
    }

    //actions

    /**
     * Invokes an action to load a new page of rows
     *
     * @returns {Promise}
     * @memberof GavantTableComponent
     */
    @action
    onLastReached() {
        if (!this.isLoading && this.hasMoreRows) {
            return tryInvoke(this, 'loadMoreRows');
        }
        return;
    }

    /**
     * Pans the table's visible columns to the left
     *
     * @returns {void}
     * @memberof GavantTableComponent
     */
    @action
    panColumnsLeft() {
        return this.panColumns(-1);
    }

    /**
     * Pans the table's visible columns to the right
     *
     * @returns {void}
     * @memberof GavantTableComponent
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
     * @memberof GavantTableComponent
     */
    @action
    onUpdateSorts(sorts: any[]) {
        set(this, 'sorts', sorts);
        return tryInvoke(this, 'updateSorts', [sorts]);
    }
}

export default GavantTableComponent;
