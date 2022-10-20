import { action } from '@ember/object';
import Component from '@glimmer/component';

type BodyCellComponent = {
    Args: {
        cellValue: any;
        columnValue: any;
        rowValue: any;
        cellMeta: any;
        columnMeta: any;
        rowMeta: any;
        tableMeta: any;
    };
    Blocks: {
        default: [];
    };
};

export default class TableCellButtonComponent extends Component<BodyCellComponent> {
    @action
    onClick(event: Event) {
        event.stopPropagation();
        this.args.columnValue.toggleRow({ event: this.args.rowValue });
    }
}
