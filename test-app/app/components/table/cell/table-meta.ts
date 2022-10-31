import Component from '@glimmer/component';

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
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
};

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class TableCellTableMetaComponent extends Component<BodyCellComponent> {}
