import { action } from '@ember/object';
import Component from '@glimmer/component';

import { BodyCellArgs } from '@gavant/ember-table/components/table';

import TableController from 'test-app/controllers/table';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

interface TableCellButtonComponentSignature {
    Args: BodyCellArgs<TableController['columns'][5], ArrayElement<TableController['model']>>;
}
export default class TableCellButtonComponent extends Component<TableCellButtonComponentSignature> {
    @action
    onClick(event: Event) {
        event.stopPropagation();
        this.args.cellValue;
        this.args.columnValue.toggleRow?.({ event: this.args.rowValue });
    }
}
