declare module 'ember-table/components/ember-table/component';
declare module 'ember-table/components/ember-tbody/component';

declare module 'table-components' {
    interface TableColumn {
        id?: string;
        valuePath: string;
        name: string;
        isFixedLeft: boolean;
        width: number;
        staticWidth: number;
        minWidth?: number;
        maxWidth?: number;
        textAlign?: string;
        isVisible?: boolean;
        isSortable?: boolean;
    }

    interface TableSort {
        valuePath: string;
        isAscending: boolean;
    }
}
