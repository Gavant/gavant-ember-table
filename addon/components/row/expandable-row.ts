import TableRow from '../row/table-row';

export default class ExpandableRow extends TableRow {
    get isExpanded() {
        return this.rowMeta.isExpanded ?? false;
    }
}
