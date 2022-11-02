import Component from '@glimmer/component';

import { BodyCellArgs } from '@gavant/ember-table/components/table';

import TableController from 'test-app/controllers/table';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

interface TableCellButtonComponentSignature {
    Args: BodyCellArgs<TableController['columns'][0], ArrayElement<TableController['model']>>;
}
// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TableCellTableMetaComponent extends Component<TableCellButtonComponentSignature> {}
