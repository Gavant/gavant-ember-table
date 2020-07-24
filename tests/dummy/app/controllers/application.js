import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

class ApplicationController extends Controller {
    @tracked foobar = 'bar';
    @tracked expandedRows = A([]);

    @tracked columns = A([
        {
            valuePath: 'date',
            name: 'Date',
            cellComponent: 'table/cell/table-meta',
            isFixedLeft: true,
            width: 200,
            staticWidth: 200
        },
        {
            valuePath: 'name',
            name: 'Name',
            isFixedLeft: false,
            width: 100,
            staticWidth: 100
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
            valuePath: 'id',
            cellComponent: 'table/cell/button',
            width: 225,
            staticWidth: 225,
            maxWidth: 225,
            minWidth: 225,
            toggleRow: this.toggleRow
        }
    ]);

    @tracked otherColumns = false;

    data = [
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        },
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        },
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        },
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        },
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        },
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        },
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        },
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true,
            id: '67'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false,
            id: '63'
        }
    ];

    footerData = [{ age: 295 }];

    @tracked resizeDebounce = 100;
    @tracked showHeader = true;
    @tracked stripedRows = false;
    @tracked enableSort = true;

    @action
    updateFoobar(event) {
        this.foobar = event.target.value;
    }

    @action
    loadMoreModels() {
        return;
    }

    @action
    updateSorts() {
        return;
    }

    @action
    toggleRow(rowValue) {
        const expandedRows = this.expandedRows.concat([]);
        const rowExpanded = expandedRows.includes(rowValue);
        if (rowExpanded) {
            const ind = expandedRows.indexOf(rowValue);
            expandedRows.splice(ind, 1);
        } else {
            expandedRows.push(rowValue);
        }
        this.expandedRows = expandedRows;
    }

    @action
    toggleColumns() {
        this.resizeDebounce = this.resizeDebounce === 100 ? 2000 : 100;
        this.showHeader = !this.showHeader;
        this.stripedRows = !this.stripedRows;
        this.enableSort = !this.enableSort;
    }
}

export default ApplicationController;
