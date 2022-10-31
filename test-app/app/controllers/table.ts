import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import MediaService from 'ember-responsive/services/media';

import { Column } from '@gavant/ember-table/components/table';

import rsvp from 'rsvp';
import TableCellButtonComponent from 'test-app/components/table/cell/button';
import TableCellTableMetaComponent from 'test-app/components/table/cell/table-meta';

interface TestRow {
    name: string;
    age: number;
    tall: boolean;
    short: boolean;
    id: string;
}
type ColumnValueType<T> = T extends Column<infer CV, any, any, any, any, any> ? Readonly<CV> : never;

export function makeColumns<
    T extends ReadonlyArray<Column<CV extends string ? CV : never, any, unknown, any, unknown, unknown>>,
    CV = ColumnValueType<T[number]>
>(items: [...T]) {
    return items;
}

class TableController extends Controller {
    @service declare media: MediaService;

    @tracked foobar = 'bar';
    @tracked expandedRows: NativeArray<any> = A([]);
    @tracked hasMore = true;
    @tracked isLoading = false;
    @tracked sorts = [{ valuePath: 'date', isAscending: false }];
    @tracked panPosition = 0;

    columns = makeColumns([
        {
            valuePath: 'date',
            name: 'Date',
            cellComponent: TableCellTableMetaComponent,
            isFixedLeft: true,
            width: 200,
            staticWidth: 200,
            isSortable: true
        },
        {
            valuePath: 'name',
            name: 'Name',
            isFixedLeft: false,
            width: 100,
            staticWidth: 100,
            isSortable: true
        },
        {
            valuePath: 'age',
            name: 'Age',
            isFixedLeft: false,
            textAlign: 'right',
            width: 100,
            staticWidth: 100
        },
        {
            valuePath: 'tall',
            name: 'Tall',
            isFixedLeft: false,
            width: 100,
            staticWidth: 100,
            maxWidth: 100,
            minWidth: 100
        },
        {
            valuePath: 'short',
            name: 'Short',
            isFixedLeft: false,
            width: 100,
            staticWidth: 200,
            maxWidth: 100,
            minWidth: 100
        },
        {
            valuePath: 'tall',
            cellComponent: TableCellButtonComponent,
            width: 225,
            staticWidth: 225,
            maxWidth: 225,
            minWidth: 225,
            toggleRow: this.toggleRow
        }
    ]);

    @tracked otherColumns = false;

    @tracked model: NativeArray<TestRow> = A([]);

    footerData = [{ age: 295 }];

    @tracked resizeDebounce = 100;
    @tracked showHeader = true;
    @tracked stripedRows = false;
    @tracked enableSort = true;

    @action
    updateFoobar(event: any) {
        this.foobar = event.target?.value;
    }

    @action
    loadMoreModels(): Promise<TestRow[]> {
        this.isLoading = true;
        return new rsvp.Promise((resolve) => {
            later(() => {
                const newRows: any[] = [];
                for (let i = 0; i <= 10; i++) {
                    newRows.push({
                        date: new Date().toISOString(),
                        name: `New Row ${i}`,
                        age: 150,
                        tall: false,
                        short: true,
                        id: `${Date.now() + i}`
                    });
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.model.pushObjects(newRows);
                this.isLoading = false;
                return resolve(newRows);
            }, 500);
        });
    }

    @action
    updateSorts(newSorts: any) {
        this.sorts = newSorts;
    }

    @action
    toggleRow(event: any) {
        const rowValue = event.rowValue as any;
        const expandedRows = this.expandedRows.concat([]);
        const rowExpanded = expandedRows.includes(rowValue);
        if (rowExpanded) {
            const ind = expandedRows.indexOf(rowValue);
            expandedRows.splice(ind, 1);
        } else {
            expandedRows.push(rowValue);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.expandedRows = expandedRows;
    }

    @action
    toggleColumns() {
        this.resizeDebounce = this.resizeDebounce === 100 ? 2000 : 100;
        this.showHeader = !this.showHeader;
        this.stripedRows = !this.stripedRows;
        this.enableSort = !this.enableSort;
    }

    @action
    updatePanPosition() {
        this.panPosition = this.panPosition + 1;
    }
}

export default TableController;
