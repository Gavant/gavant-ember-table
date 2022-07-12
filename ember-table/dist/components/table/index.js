import { _ as _defineProperty } from '../../defineProperty-f419f636.js';
import { _ as _applyDecoratedDescriptor } from '../../applyDecoratedDescriptor-e87190e7.js';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { scheduleOnce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { FillMode } from '../../constants/table.js';

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

var TEMPLATE = hbs("{{! template-lint-disable no-inline-styles }}\n<div\n    class=\"data-table\n        {{if this.hasHiddenColumns \' has-hidden-columns\'}}\n        {{if @isServerRendered \' is-server-rendered\'}}\n        {{if this.isColumnsPanned \' is-columns-panned\'}}\"\n    id={{this.elementId}}\n    ...attributes\n    {{did-update this.debouncedRender @columns}}\n    {{did-update this.updatePanPosition @columnPanPosition}}\n    {{did-insert this.didInsertTable}}\n>\n    <div {{on-resize this.debouncedRender debounce=this.resizeDebounce}}></div>\n    <EmberTable\n        style={{this.height}}\n        @tableId={{this.tableId}}\n        @tableClasses={{this.tableClassNames}}\n        @headerStickyOffset={{this.headerStickyOffset}}\n        @footerStickyOffset={{this.footerStickyOffset}}\n        as |T|\n    >\n        {{#if this.showHeader}}\n            <T.head\n                @columns={{this.visibleColumns}}\n                @enableResize={{this.enableResize}}\n                @enableReorder={{this.enableReorder}}\n                @widthConstraint={{this.widthConstraint}}\n                @fillMode={{this.fillMode}}\n                @fillColumnIndex={{this.adjustedFillColumnIndex}}\n                @resizeMode={{this.resizeMode}}\n                @sortFunction={{@sortFunction}}\n                @onHeaderAction={{@onHeaderAction}}\n                @onUpdateSorts={{if this.enableSort this.onUpdateSorts}}\n                @onReorder={{@onReorder}}\n                @onResize={{@onResize}}\n                @sorts={{this.sorts}}\n                as |Head|\n            >\n                <Head.row as |Row|>\n                    <Row.cell\n                        class={{concat\n                            Row.columnValue.headerClassNames\n                            (if Row.columnValue.isFixedLeft \" data-table-col-fixed-left\")\n                            (if (eq Row.columnValue this.firstVisibleNonFixedColumn) \" data-table-col-first-nonfixed\")\n                            (if\n                                (and this.canPanRight (eq Row.columnValue this.visibleColumns.lastObject))\n                                \"data-table-col-has-pan-btn\"\n                            )\n                        }}\n                        as |columnValue columnMeta|\n                    >\n                        {{#if columnValue.headerComponent}}\n                            {{#component\n                                columnValue.headerComponent\n                                columnValue=columnValue\n                                columnMeta=columnMeta\n                                tableMeta=@tableMeta\n                            }}\n                                {{columnValue.name}}\n                                <EmberTh::SortIndicator @columnMeta={{columnMeta}} />\n                                {{#if this.enableUserResize}}\n                                    <EmberTh::ResizeHandle @columnMeta={{columnMeta}} />\n                                {{/if}}\n                                {{#if (and this.canPanLeft (eq columnValue this.firstVisibleColumn))}}\n                                    <button\n                                        class=\"data-table-col-pan-btn data-table-col-pan-btn-left\n                                            {{this.panButtonClass}}\"\n                                        type=\"button\"\n                                        {{on \"click\" this.panColumnsLeft}}\n                                    >\n                                        &#8592;\n                                    </button>\n                                {{/if}}\n\n                                {{#if (and this.canPanRight (eq columnValue this.visibleColumns.lastObject))}}\n                                    <button\n                                        class=\"data-table-col-pan-btn data-table-col-pan-btn-right\n                                            {{this.panButtonClass}}\"\n                                        type=\"button\"\n                                        {{on \"click\" this.panColumnsRight}}\n                                    >\n                                        &#8594;\n                                    </button>\n                                {{/if}}\n                            {{/component}}\n                        {{else}}\n                            {{or columnValue.name this.nonBreakingSpace}}\n                            <EmberTh::SortIndicator @columnMeta={{columnMeta}} />\n                            {{#if this.enableUserResize}}\n                                <EmberTh::ResizeHandle @columnMeta={{columnMeta}} />\n                            {{/if}}\n                            {{#if (and this.canPanLeft (eq columnValue this.firstVisibleColumn))}}\n                                <button\n                                    class=\"data-table-col-pan-btn data-table-col-pan-btn-left {{this.panButtonClass}}\"\n                                    type=\"button\"\n                                    {{on \"click\" this.panColumnsLeft}}\n                                >\n                                    &#8592;\n                                </button>\n                            {{/if}}\n\n                            {{#if (and this.canPanRight (eq columnValue this.visibleColumns.lastObject))}}\n                                <button\n                                    class=\"data-table-col-pan-btn data-table-col-pan-btn-right {{this.panButtonClass}}\"\n                                    type=\"button\"\n                                    {{on \"click\" this.panColumnsRight}}\n                                >\n                                    &#8594;\n                                </button>\n                            {{/if}}\n                        {{/if}}\n                    </Row.cell>\n                </Head.row>\n            </T.head>\n        {{/if}}\n        <T.body\n            @isLoading={{@isLoading}}\n            @showBottomLoading={{this.showBottomLoading}}\n            @showTopLoading={{this.showTopLoading}}\n            @isEmpty={{this.isEmpty}}\n            @noResultsText={{this.noResultsText}}\n            @rows={{@rows}}\n            @bufferSize={{this.bufferSize}}\n            @estimateRowHeight={{this.estimateRowHeight}}\n            @idForFirstItem={{@idForFirstItem}}\n            @key={{this.key}}\n            @renderAll={{this.renderAll}}\n            @containerSelector={{this.containerSelector}}\n            @firstReached={{this.onFirstReached}}\n            @lastReached={{this.onLastReached}}\n            @tableMeta={{@tableMeta}}\n            @rowComponent={{this.rowComponent}}\n            @checkboxSelectionMode={{this.checkboxSelectionMode}}\n            @staticHeight={{@staticHeight}}\n            as |Body|\n        >\n            <Body.row\n                class={{Body.rowValue.rowClassNames}}\n                @onClick={{@onRowClick}}\n                @onDoubleClick={{@onRowDoubleClick}}\n                as |Row|\n            >\n                <Row.cell\n                    class={{concat\n                        Row.columnValue.cellClassNames\n                        (if Row.columnValue.isFixedLeft \" data-table-col-fixed-left\")\n                        (if (eq Row.columnValue this.firstVisibleNonFixedColumn) \" data-table-col-first-nonfixed\")\n                    }}\n                    @tableMeta={{@tableMeta}}\n                    @onClick={{@onCellClick}}\n                    @onDoubleClick={{@onCellDoubleClick}}\n                    as |cellValue columnValue rowValue cellMeta columnMeta rowMeta|\n                >\n                    {{#if columnValue.cellComponent}}\n                        {{#component\n                            columnValue.cellComponent\n                            cellValue=cellValue\n                            columnValue=columnValue\n                            rowValue=rowValue\n                            cellMeta=cellMeta\n                            columnMeta=columnMeta\n                            rowMeta=rowMeta\n                            tableMeta=@tableMeta\n                        }}\n                            {{cellValue}}\n                        {{/component}}\n                    {{else}}\n                        {{cellValue}}\n                    {{/if}}\n                </Row.cell>\n            </Body.row>\n        </T.body>\n        <T.foot @rows={{if (and (or this.showEmptyFooter @rows) this.footerRows) this.footerRows}} as |Foot|>\n            <Foot.row as |Row|>\n                <Row.cell\n                    class={{concat\n                        Row.columnValue.footerClassNames\n                        (if Row.columnValue.isFixedLeft \" data-table-col-fixed-left\")\n                        (if (eq Row.columnValue this.firstVisibleNonFixedColumn) \" data-table-col-first-nonfixed\")\n                    }}\n                    as |cellValue columnValue rowValue cellMeta columnMeta rowMeta|\n                >\n                    {{#if columnValue.footerComponent}}\n                        {{#component\n                            columnValue.footerComponent\n                            cellValue=(or (get rowValue columnValue.footerValuePath) cellValue)\n                            columnValue=columnValue\n                            rowValue=rowValue\n                            cellMeta=cellMeta\n                            columnMeta=columnMeta\n                            rowMeta=rowMeta\n                            tableMeta=@tableMeta\n                        }}\n                            {{cellValue}}\n                        {{/component}}\n                    {{else}}\n                        {{cellValue}}\n                    {{/if}}\n                </Row.cell>\n            </Foot.row>\n        </T.foot>\n    </EmberTable>\n</div>");

function argDefault(_target, propertyKey, descriptor) {
  return {
    get() {
      return this.args[propertyKey] ?? descriptor.initializer();
    }

  };
}

var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37;
let TableComponent = (_class = class TableComponent extends Component {
  //ember-table's resizing must be enabled in order for fill-mode auto column
  //resizing to work, even if you don't want to allow user-invoked resizing

  /**
   * Returns a unique data-table ID
   *
   * @readonly
   * @type {string} tableId
   * @memberof TableComponent
   */
  get tableId() {
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


  get height() {
    const isNumber = typeof this.tableHeight === 'number';
    return htmlSafe(this.tableHeight ? `height: ${this.tableHeight}${isNumber ? 'px' : ''};` : '');
  }

  get nonBreakingSpace() {
    return htmlSafe('&nbsp;');
  }

  get noRows() {
    return this.args.rows.length === 0;
  }

  get notLoading() {
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


  get clickableRows() {
    return !!this.args.onRowClick || !!this.args.onRowDoubleClick;
  }
  /**
   * Returns whether a fully-loaded table is empty.
   *
   * @readonly
   * @type {boolean}
   */


  get isEmpty() {
    return this.noRows && this.notLoading;
  }
  /**
   * Returns whether there are non-render columns.
   *
   * @readonly
   * @type {boolean}
   */


  get hasHiddenColumns() {
    return this.visibleColumns.length < this.args.columns.length;
  }
  /**
   * Returns whether the table is currently panned.
   *
   * @readonly
   * @type {boolean}
   */


  get isColumnsPanned() {
    return this.columnPanPosition > 0;
  }
  /**
   * Returns true when `containerWidth` >= `minFixedColTableWidth`.
   *
   * @readonly
   * @type {boolean}
   */


  get allowFixedCols() {
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


  get firstVisibleNonFixedColumn() {
    return this.visibleColumns && this.visibleColumns.find(col => !col.isFixedLeft);
  }
  /**
   * Returns the array of fixed columns.
   *
   * @readonly
   * @type {NativeArray<ColumnValue>}
   */


  get fixedColumns() {
    return A((this.args.columns || A()).filter(col => col.isFixedLeft));
  }
  /**
   * Returns the array of non-fixed columns.
   *
   * @readonly
   * @type {NativeArray<ColumnValue>}
   */


  get nonFixedColumns() {
    return A((this.args.columns || A()).filter(col => !col.isFixedLeft));
  }
  /**
   * Determines the minimum table width when
   * fixed columns are present, else returns 0
   *
   * @readonly
   * @type {number} minFixedColTableWidth
   * @memberof TableComponent
   */


  get minFixedColTableWidth() {
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


  get canPanRight() {
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


  get canPanLeft() {
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
  /**
   * Returns a new fillColumnIndex when the current
   * fillColumnIndex is out of range
   *
   * @readonly
   * @type {(number | null)} adjustedFillColumnIndex
   * @memberof TableComponent
   */


  get adjustedFillColumnIndex() {
    if (this.fillColumnIndex) {
      return this.fillColumnIndex > this.visibleColumns.length - 1 ? 0 : this.fillColumnIndex;
    } else {
      return 0;
    }
  } //methods

  /**
   * Initialize the table component's `visibleColumns`
   *
   * @memberof TableComponent
   */


  constructor(owner, args) {
    super(owner, args);

    _defineProperty(this, "enableResize", true);

    _defineProperty(this, "elementId", guidFor(this));

    _initializerDefineProperty(this, "bufferSize", _descriptor, this);

    _initializerDefineProperty(this, "containerSelector", _descriptor2, this);

    _initializerDefineProperty(this, "constrainColumnsToFit", _descriptor3, this);

    _initializerDefineProperty(this, "enableReorder", _descriptor4, this);

    _initializerDefineProperty(this, "enableSort", _descriptor5, this);

    _initializerDefineProperty(this, "enableUserResize", _descriptor6, this);

    _initializerDefineProperty(this, "estimateRowHeight", _descriptor7, this);

    _initializerDefineProperty(this, "fillColumnIndex", _descriptor8, this);

    _initializerDefineProperty(this, "fillMode", _descriptor9, this);

    _initializerDefineProperty(this, "footerRows", _descriptor10, this);

    _initializerDefineProperty(this, "hasMoreRows", _descriptor11, this);

    _initializerDefineProperty(this, "hoverableRows", _descriptor12, this);

    _initializerDefineProperty(this, "isLoading", _descriptor13, this);

    _initializerDefineProperty(this, "noResultsText", _descriptor14, this);

    _initializerDefineProperty(this, "panButtonClass", _descriptor15, this);

    _initializerDefineProperty(this, "renderAll", _descriptor16, this);

    _initializerDefineProperty(this, "resizeDebounce", _descriptor17, this);

    _initializerDefineProperty(this, "resizeMode", _descriptor18, this);

    _initializerDefineProperty(this, "resizeWidthSensitive", _descriptor19, this);

    _initializerDefineProperty(this, "rowComponent", _descriptor20, this);

    _initializerDefineProperty(this, "showEmptyFooter", _descriptor21, this);

    _initializerDefineProperty(this, "showHeader", _descriptor22, this);

    _initializerDefineProperty(this, "small", _descriptor23, this);

    _initializerDefineProperty(this, "sortEmptyLast", _descriptor24, this);

    _initializerDefineProperty(this, "stripedRows", _descriptor25, this);

    _initializerDefineProperty(this, "tableClass", _descriptor26, this);

    _initializerDefineProperty(this, "tableHeight", _descriptor27, this);

    _initializerDefineProperty(this, "widthConstraint", _descriptor28, this);

    _initializerDefineProperty(this, "headerStickyOffset", _descriptor29, this);

    _initializerDefineProperty(this, "footerStickyOffset", _descriptor30, this);

    _initializerDefineProperty(this, "sorts", _descriptor31, this);

    _initializerDefineProperty(this, "key", _descriptor32, this);

    _initializerDefineProperty(this, "isMobile", _descriptor33, this);

    _initializerDefineProperty(this, "columnPanPosition", _descriptor34, this);

    _initializerDefineProperty(this, "containerWidth", _descriptor35, this);

    _initializerDefineProperty(this, "visibleColumns", _descriptor36, this);

    _initializerDefineProperty(this, "containerElement", _descriptor37, this);

    assert('@rows is not an instanceof Array.', args.rows instanceof Array);
    assert('@columns is not an instanceof Array', args.columns instanceof Array);
    this.visibleColumns = this.args.columns;
  }
  /**
   * Handles initial column visibility manipulation when the table is first rendered
   *
   * @memberof TableComponent
   */


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
    const visibleColumns = A([]);
    const containerWidth = this.getElementWidth(this.containerElement);
    const allowFixedCols = containerWidth >= this.minFixedColTableWidth;
    const panPosition = this.columnPanPosition;
    let newTableWidth = 0;

    for (const [i, col] of columns.entries()) {
      const colIndex = allowFixedCols ? this.nonFixedColumns.indexOf(col) : i;

      if (col && col.isFixedLeft && allowFixedCols || colIndex >= panPosition) {
        const colWidth = col.staticWidth || 0;
        const isVisible = col.isFixedLeft && allowFixedCols || newTableWidth + colWidth <= containerWidth;

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


  panColumns(moveIndex) {
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


  getElementWidth(el) {
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


  getColumnId(col) {
    return col && (col.id || col.valuePath);
  } //actions

  /**
   * Invokes an action to load a new page of rows when the first row in the table is reached/in view
   *
   * @returns {Promise | void}
   * @memberof TableComponent
   */


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


  panColumnsLeft() {
    return this.panColumns(-1);
  }
  /**
   * Pans the table's visible columns to the right
   *
   * @returns {void}
   * @memberof TableComponent
   */


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


  onUpdateSorts(sorts) {
    if (this.args.onUpdateSorts) {
      this.args.onUpdateSorts(sorts);
    }
  }

}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "bufferSize", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "containerSelector", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 'body';
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "constrainColumnsToFit", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "enableReorder", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "enableSort", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, "enableUserResize", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, "estimateRowHeight", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 30;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, "fillColumnIndex", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, "fillMode", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return FillMode.FIRST;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, "footerRows", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return [];
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, "hasMoreRows", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, "hoverableRows", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return true;
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, "isLoading", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class.prototype, "noResultsText", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 'No results found';
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class.prototype, "panButtonClass", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 'btn btn-secondary';
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class.prototype, "renderAll", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class.prototype, "resizeDebounce", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 250;
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class.prototype, "resizeMode", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 'standard';
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class.prototype, "resizeWidthSensitive", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return true;
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class.prototype, "rowComponent", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 'ember-tr';
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class.prototype, "showEmptyFooter", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class.prototype, "showHeader", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return true;
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class.prototype, "small", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class.prototype, "sortEmptyLast", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class.prototype, "stripedRows", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class.prototype, "tableClass", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 'table';
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class.prototype, "tableHeight", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return '';
  }
}), _descriptor28 = _applyDecoratedDescriptor(_class.prototype, "widthConstraint", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 'lte-container';
  }
}), _descriptor29 = _applyDecoratedDescriptor(_class.prototype, "headerStickyOffset", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor30 = _applyDecoratedDescriptor(_class.prototype, "footerStickyOffset", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor31 = _applyDecoratedDescriptor(_class.prototype, "sorts", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return [];
  }
}), _descriptor32 = _applyDecoratedDescriptor(_class.prototype, "key", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return '@identity';
  }
}), _descriptor33 = _applyDecoratedDescriptor(_class.prototype, "isMobile", [argDefault], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor34 = _applyDecoratedDescriptor(_class.prototype, "columnPanPosition", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return this.args.columnPanPosition ?? 0;
  }
}), _descriptor35 = _applyDecoratedDescriptor(_class.prototype, "containerWidth", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _descriptor36 = _applyDecoratedDescriptor(_class.prototype, "visibleColumns", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return A([]);
  }
}), _descriptor37 = _applyDecoratedDescriptor(_class.prototype, "containerElement", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _applyDecoratedDescriptor(_class.prototype, "didInsertTable", [action], Object.getOwnPropertyDescriptor(_class.prototype, "didInsertTable"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "debouncedRender", [action], Object.getOwnPropertyDescriptor(_class.prototype, "debouncedRender"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "updatePanPosition", [action], Object.getOwnPropertyDescriptor(_class.prototype, "updatePanPosition"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onFirstReached", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onFirstReached"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onLastReached", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onLastReached"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "panColumnsLeft", [action], Object.getOwnPropertyDescriptor(_class.prototype, "panColumnsLeft"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "panColumnsRight", [action], Object.getOwnPropertyDescriptor(_class.prototype, "panColumnsRight"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onUpdateSorts", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onUpdateSorts"), _class.prototype)), _class);
var index = setComponentTemplate(TEMPLATE, TableComponent);

export { index as default };
