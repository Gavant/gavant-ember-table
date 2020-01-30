import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';

class ApplicationController extends Controller {
    columns = A([
        {
            valuePath: 'date',
            name: 'Date',
            isFixedLeft: true,
            width: 200,
            staticWidth: 200
        },
        {
            valuePath: 'name',
            name: 'Name',
            isFixedLeft: false,
            width: 100,
            staticWidth: 100,
            maxWidth: 100,
            minWidth: 100
        },
        {
            valuePath: 'age',
            name: 'Age',
            isFixedLeft: false,
            textAlign: 'right',
            width: 100,
            staticWidth: 100,
            maxWidth: 100,
            minWidth: 100
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
            staticWidth: 100,
            maxWidth: 100,
            minWidth: 100
        }
    ]);

    data = [
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false,
            short: true
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true,
            short: false
        }
    ];

    footerData = [{ age: 295 }];

    @action
    loadMoreModels() {
        return;
    }

    @action
    updateSorts() {
        return;
    }

    @action
    alertData(row) {
        const data = row.rowValue;
        alert(`${data.name} is ${data.age} years old.`);
    }
}

export default ApplicationController;
