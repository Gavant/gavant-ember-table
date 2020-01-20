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
            staticWidth: 100
        },
        {
            valuePath: 'name',
            name: 'Name',
            isFixedLeft: false,
            width: 200,
            staticWidth: 200,
            maxWidth: 200,
            minWidth: 200
        },
        {
            valuePath: 'age',
            name: 'Age',
            isFixedLeft: false,
            width: 200,
            staticWidth: 200,
            maxWidth: 200,
            minWidth: 200
        },
        {
            valuePath: 'tall',
            name: 'Tall',
            isFixedLeft: false,
            width: 200,
            staticWidth: 200,
            maxWidth: 200,
            minWidth: 200
        },
        {
            valuePath: 'short',
            name: 'Short',
            isFixedLeft: false,
            width: 100,
            staticWidth: 200,
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

    @action
    loadMoreModels() {
        return;
    }

    @action
    updateSorts() {
        return;
    }
}

export default ApplicationController;
