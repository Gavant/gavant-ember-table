declare module 'ember-table/components/ember-table/component';
declare module 'ember-table/components/ember-tbody/component';

declare function pluck<T, K extends keyof T>(o: T, propertyNames: K[] | K): T[K][] | T[K] {
    return Array.isArray(propertyNames) ? propertyNames.map((n) => o[n]) : o[propertyNames];
};

declare module '@gavant/ember-table' {
    export interface ColumnValue {
        [index: string]: any;
        id?: string;
        valuePath?: string;
        name: string;
        isFixedLeft?: boolean;
        width: number;
        staticWidth: number;
        minWidth?: number;
        maxWidth?: number;
        textAlign?: string;
        isSortable?: boolean;
        headerClassNames?: string;
        headerComponent?: string;
        cellClassNames?: string;
        cellComponent?: string;
        footerValuePath?: string;
        footerClassNames?: string;
        footerComponent?: string;
    }

    export interface TableSort {
        valuePath: string;
        isAscending: boolean;
    }

    export interface ColumnMeta {
        //attributes
        readonly isLeaf: boolean;
        readonly isFixed: boolean;
        readonly isReorderable: boolean;
        readonly isResizable: boolean;
        readonly isSortable: boolean;
        readonly offsetLeft: number;
        readonly offsetRight: number;
        readonly width: number;
        readonly columnSpan: number;
        readonly rowSpan: number;
        readonly index: number;
        readonly isMultiSorted: boolean;
        readonly isSorted: boolean;
        readonly isSortedAsc: boolean;
        readonly sortIndex: number;
    }

    export interface RowMeta<T> {
        //attributes
        readonly index: number;
        readonly canCollapse: boolean;
        readonly depth: number;
        readonly isCollapsed: boolean;
        readonly isGroupSelected: boolean;
        readonly isSelected: boolean;
        readonly first: T;
        readonly last: T;
        readonly next: T;
        readonly prev: T;
    }

    export interface RowClickEvent<T> {
        event: MouseEvent;
        cellValue?: any;
        columnValue: ColumnValue;
        rowValue: T;
    }
}
