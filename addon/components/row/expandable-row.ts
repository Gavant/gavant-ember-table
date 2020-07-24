import TableRow from '../row/table-row';
import Ember from 'ember';

export default class ExpandableRow extends TableRow {
    get isExpanded() {
        return this.args.tableMeta.expandedRows?.includes(this.rowValue) ?? false;
    }

    get collapsedStyle() {
        return Ember.String.htmlSafe(!this.isExpanded ? 'display:none;' : '');
    }
}
