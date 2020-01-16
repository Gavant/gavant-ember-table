import Component from '@ember/component';
import { or, empty, not, and, readOnly, gt } from '@ember/object/computed';
import { lt, gte, conditional } from 'ember-awesome-macros';
import { t } from 'ember-intl';
import ResizeAware from 'ember-resize/mixins/resize-aware';
import { set, computed, get, setProperties, action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { A } from '@ember/array';
import { tryInvoke } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import Array from 'ember__array';

class TableComponent extends Component.extend({ ResizeAware }) {
    //configuration options
    [key: string]: any;
    showHeader = false;
    noResultsText: string | null = null;
    tableClass = 'table';
    stripedRows = false;
    hoverableRows = true;
    small = true;
    enableUserResize = false;
    //ember-table's resizing must be enabled in order for fill-mode auto column
    //resizing to work, even if you don't want to allow user-invoked resizing
    enableResize = true;
    enableReorder = false;
    enableSort = false;
    sortFunction: any = null;
    //the selector used by <VerticalCollection> to calculate occulsion rendering
    //set this to `null` for fixed height/scrollable tables
    containerSelect = '#bm-content';
    widthConstraint = 'eq-container';
    fillMode = 'first-column';
    fillColumnIndex: number | null = null;
    resizeMode = 'standard';
    bufferSize = 0;
    estimateRowHeight = 30;
    renderAllRows = false;
    constrainColumnsToFit = true;
    showEmptyFooter = false;

    //component state
    columns: Array<any> = A();
    visibleColumns: Array<any> = A();
    columnPanPosition = 0;
    rows: any[] = [];
    sorts: any[] = [];
    isLoading = false;
    hasMoreRows = false;
    hasHiddenOverflow = false;
    containerWidth: number | null = null;

    //readonly attributes
    @t('tables.noResults') defaultNoResultsText!: string;
    @or('onRowClick', 'onRowDoubleClick') clickableRows!: boolean;
    @empty('rows') noRows!: boolean;
    @not('isLoading') notLoading!: boolean;
    @and('noRows', 'notLoading') isEmpty!: boolean;
    @readOnly('fastboot.isFastBoot') isServerRendered!: boolean;
    @lt('visibleColumns.length', 'columns.length') hasHiddenColumns!: boolean;
    @gt('columnPanPosition', 0) isColumnsPanned!: boolean;
    @gte('containerWidth', 'minFixedColTableWidth') allowFixedCols!: boolean;
    @conditional('allowFixedCols', 'firstVisibleNonFixedColumn', 'visibleColumns.firstObject') firstVisibleColumn!: any;

    /**
     * initialize the table component's visible columns
     * @return {Void}
     */
    init() {
        super.init();
        set(this, 'visibleColumns', this.columns);
    }

    @computed('visibleColumns.@each.isFixedLeft')
    get firstVisibleNonFixedColumn() {
        return this.visibleColumns && this.visibleColumns.find((col) => !col.isFixedLeft);
    }

    @computed('columns.@each.isFixedLeft')
    get fixedColumns() {
        return (this.columns || A()).filter((col) => col.isFixedLeft);
    }

    @computed('columns.@each.isFixedLeft')
    get nonFixedColumns(): Array<any> {
        return (this.columns || A()).filter((col) => !col.isFixedLeft);
    }

    // @computed('fixedColumns.@each.width', 'nonFixedColumns.@each.width')
    // get minFixedColTableWidth() {
    //     //fixed columns are disabled if the widest non-fixed column cannot
    //     //fit in the container at the same time as the fixed column(s)
    //     if (!isEmpty(this.fixedColumns)) {
    //         const widestColumn = this.nonFixedColumns.sortBy('staticWidth').lastObject;
    //         const widestColumnWidth = widestColumn ? widestColumn.staticWidth : 0;
    //         const fixedWidth = this.fixedColumns.reduce((prev, col) => prev + col.staticWidth, 0);
    //         return widestColumnWidth + fixedWidth;
    //     } else {
    //         return 0;
    //     }
    // }

    @computed('hasHiddenColumns', 'columns.lastObject.{id,valuePath}', 'visibleColumns.lastObject.{id,valuePath}')
    get canPanRight() {
        //columns can be panned right if there is hidden columns
        //and the last visible column is not the last defined column
        const lastColId = this.getColumnId(this.columns.lastObject);
        const visibleColId = this.getColumnId(this.visibleColumns.lastObject);
        return this.hasHiddenColumns && lastColId && visibleColId && lastColId !== visibleColId;
    }

    @computed(
        'hasHiddenColumns',
        'allowFixedCols',
        'columns.firstObject.{id,valuePath}',
        'nonFixedColumns.firstObject.{id,valuePath}',
        'firstVisibleColumn.{id,valuePath}'
    )
    get canPanLeft() {
        //columns can be panned left if there is hidden columns
        //and the first visible column (first NON-FIXED visible column, if fixed columns are enabled)
        //is not the first defined column
        const firstColId = this.getColumnId(this.columns.firstObject);
        const nonFixedColId = this.getColumnId(this.nonFixedColumns.firstObject);
        const colId = this.allowFixedCols ? nonFixedColId : firstColId;
        const visibleColId = this.getColumnId(this.firstVisibleColumn);
        return this.hasHiddenColumns && colId && visibleColId && colId !== visibleColId;
    }

    @computed('elementId')
    get tableId() {
        return `data-table-${this.elementId}`;
    }

    @computed('tableHeight')
    get height() {
        return htmlSafe(this.tableHeight ? `height: ${this.tableHeight};` : '');
    }

    @computed('tableClass', 'showHeader', 'stripedRows', 'hoverableRows', 'clickableRows', 'small')
    get tableClassNames() {
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

    @computed('fillColumnIndex', 'visibleColumns.length')
    get adjustedFillColumnIndex() {
        if (this.fillColumnIndex) {
            return this.fillColumnIndex > this.visibleColumns.length - 1 ? 0 : this.fillColumnIndex;
        } else {
            return this.fillColumnIndex;
        }
    }

    /**
     * Updates the visible columns when the source columns array changes
     * @return {Void}
     */
    @computed('columns.[]')
    get onColumnsChange() {
        return scheduleOnce('afterRender', this, 'updateColumnVisibility');
    }

    /**
     * Handles initial column visibility manipulation when the table is first rendered
     * @return {Void}
     */
    didInsertElement() {
        super.didInsertElement();
        if (this.constrainColumnsToFit) {
            scheduleOnce('afterRender', this, 'updateColumnVisibility');
        }
    }

    /**
     * Handle component container element resize events and hide/show columns as needed
     * @return {Void}
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
     * @return {Void}
     */
    updateColumnVisibility() {
        const columns = this.columns || A();
        const visibleColumns = A();
        const containerWidth = this.getElementWidth(this.element);
        const allowFixedCols = containerWidth >= this.minFixedColTableWidth;
        const panPosition = this.columnPanPosition;
        let newTableWidth = 0;

        for (let i = 0; i < columns.length; i++) {
            let col = columns.objectAt(i);
            let colIndex = allowFixedCols ? this.nonFixedColumns.indexOf(col) : i;
            if ((col.isFixedLeft && allowFixedCols) || colIndex >= panPosition) {
                let colWidth = col.staticWidth || 0;
                let isVisible = (col.isFixedLeft && allowFixedCols) || newTableWidth + colWidth <= containerWidth;
                if (isVisible) {
                    newTableWidth += colWidth;
                    visibleColumns.pushObject(col);
                    // Prevent unwanted panning behaviour on mobile that occurs with more than 2 columns
                    if (get(this, 'media.isMobile') && visibleColumns.length === 2) {
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
     * @param {Number} moveIndex
     * @return {Void}
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
     * returns the computed width for the given element
     * @param {Element} el
     * @return {Number}
     */
    getElementWidth(el: Element) {
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
     * @param {Object} col
     * @return {String}
     */
    getColumnId(col: any) {
        //allow columns to specify an "id" if they dont have a valuePath, or the valuePath is not unique
        return col && (col.id || col.valuePath);
    }

    /**
     * Invokes an action to load a new page of rows
     * @return {Promise}
     */
    @action
    onLastReached() {
        if (!this.isLoading && this.hasMoreRows) {
            return tryInvoke(this, 'loadMoreRows');
        }
    }

    /**
     * Pans the table's visible columns to the left
     * @return {Void}
     */
    @action
    panColumnsLeft() {
        return this.panColumns(-1);
    }

    /**
     * Pans the table's visible columns to the right
     * @return {Void}
     */
    @action
    panColumnsRight() {
        return this.panColumns(1);
    }

    /**
     * Updates the table's column sorting
     * @param {Array} sorts
     * @return {Promise}
     */
    @action
    onUpdateSorts(sorts: any[]) {
        set(this, 'sorts', sorts);
        return tryInvoke(this, 'updateSorts', [sorts]);
    }
}

export default TableComponent;
