import { _ as _applyDecoratedDescriptor } from '../../../applyDecoratedDescriptor-e87190e7.js';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { SelectionMode } from '../../../constants/table.js';

var TEMPLATE = hbs("{{! template-lint-disable require-presentational-children }}\n<tr role=\"button\" class=\"et-tr\" {{on \"click\" this.onClick}} {{on \"dblclick\" this.onDoubleClick}}>\n    {{#each @api.cells as |api|}}\n        {{#if (has-block)}}\n            {{#if this.isHeader}}\n                {{yield\n                    (hash\n                        columnValue=api.columnValue\n                        columnMeta=api.columnMeta\n                        sorts=api.sorts\n                        sendUpdateSort=api.sendUpdateSort\n                        cell=(component \"ember-th\" api=api tableMeta=@tableMeta)\n                    )\n                }}\n            {{else}}\n                {{yield\n                    (hash\n                        api=api\n                        cellValue=api.cellValue\n                        cellMeta=api.cellMeta\n                        columnValue=api.columnValue\n                        columnMeta=api.columnMeta\n                        rowValue=api.rowValue\n                        rowMeta=api.rowMeta\n                        cell=(component \"ember-td\" api=api tableMeta=@tableMeta)\n                    )\n                }}\n            {{/if}}\n        {{else if this.isHeader}}\n            <EmberTh\n                @api={{api}}\n                @cellValue={{api.cellValue}}\n                @cellMeta={{api.cellMeta}}\n                @columnValue={{api.columnValue}}\n                @columnMeta={{api.columnMeta}}\n                @rowValue={{api.rowValue}}\n                @rowMeta={{api.rowMeta}}\n                @tableMeta={{@tableMeta}}\n            />\n        {{else}}\n            <EmberTd\n                @api={{api}}\n                @cellValue={{api.cellValue}}\n                @cellMeta={{api.cellMeta}}\n                @columnValue={{api.columnValue}}\n                @columnMeta={{api.columnMeta}}\n                @rowValue={{api.rowValue}}\n                @rowMeta={{api.rowMeta}}\n                @tableMeta={{@tableMeta}}\n            />\n        {{/if}}\n    {{/each}}\n</tr>");

var _class;
let TableRow = (_class = class TableRow extends Component {
  get rowValue() {
    return this.args.api.rowValue;
  }

  get rowMeta() {
    return this.args.api.rowMeta;
  }

  get cells() {
    return this.args.api.cells;
  }

  get rowSelectionMode() {
    return this.args.rowSelectionMode;
  }

  get isHeader() {
    return this.args.api.isHeader;
  }

  get isSelected() {
    return this.rowMeta.isSelected;
  }

  get isGroupSelected() {
    return this.rowMeta.isGroupSelected;
  }

  get isSelectable() {
    return this.rowSelectionMode === SelectionMode.MULTIPLE || this.rowSelectionMode === SelectionMode.SINGLE;
  }
  /**
   * Invoke the passed in "onRowClick" method, passing up
   * additional useful data.
   *
   * @param {MouseEvent} event
   * @returns {void}
   */


  onClick(event) {
    if (this.args.onClick) {
      const rowValue = this.rowValue;
      const rowMeta = this.rowMeta;
      const tableMeta = this.args.tableMeta;
      return this.args.onClick({
        event,
        rowValue,
        rowMeta,
        tableMeta
      });
    }
  }
  /**
   * Invoke the passed in "onRowDoubleClick" method, passing up
   * additional useful data.
   *
   * @param {MouseEvent} event
   * @returns {void}
   */


  onDoubleClick(event) {
    if (this.args.onDoubleClick) {
      const rowValue = this.rowValue;
      const rowMeta = this.rowMeta;
      const tableMeta = this.args.tableMeta;
      return this.args.onDoubleClick({
        event,
        rowValue,
        rowMeta,
        tableMeta
      });
    }
  }

}, (_applyDecoratedDescriptor(_class.prototype, "onClick", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onClick"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onDoubleClick", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onDoubleClick"), _class.prototype)), _class);
setComponentTemplate(TEMPLATE, TableRow);

export { TableRow as default };
