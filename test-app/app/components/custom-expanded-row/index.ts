import ExpandableRow from '@gavant/ember-table/components/row/expandable-row/index';

export default class PurchaseOrdersListTableExpandableRow extends ExpandableRow {
    get isEven() {
        return this.args.api.rowMeta.index % 2 === 0;
    }
}
