declare module 'ember-table' {
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
    }
}
