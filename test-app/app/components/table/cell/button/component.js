import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TableCellButtonComponent extends Component {
    @action
    onClick(event) {
        event.stopPropagation();
        this.args.columnValue.toggleRow(this.args.rowValue);
    }
}
