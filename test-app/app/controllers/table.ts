import { A } from '@ember/array';
import NativeArray from '@ember/array/-private/native-array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import MediaService from 'ember-responsive/services/media';

import makeColumns from '@gavant/ember-table/utils/make-columns';

import rsvp from 'rsvp';

interface TestRow {
    name: string;
    age: number;
    tall: boolean;
    short: boolean;
    id: string;
    date: Date;
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
            name: 'Date<br>Something Else',
            // cellComponent: TableCellTableMetaComponent,
            isFixedLeft: true,
            minWidth: 200,
            isSortable: true
        },
        {
            valuePath: 'name',
            name: 'Name<br>Title',
            isSortable: true,
            minWidth: 200
        },
        {
            valuePath: 'age',
            name: 'Age',
            minWidth: 200,
            textAlign: 'right'
        },
        {
            valuePath: 'tall',
            name: 'Tall',
            minWidth: 200
        },
        {
            valuePath: 'short',
            name: 'Short',
            minWidth: 200
        },
        {
            valuePath: 'id',
            cellComponent: 'table/cell/button',
            toggleRow: this.toggleRow,
            minWidth: 200
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
