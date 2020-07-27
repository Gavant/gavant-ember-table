import TableRow from '../row/table-row';

export default class ExpandableRow extends TableRow {
    get isExpanded() {
        return this.args.tableMeta?.expandedRows?.includes(this.rowValue) ?? false;
    }
}
