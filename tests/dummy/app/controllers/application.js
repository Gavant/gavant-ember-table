import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';

class ApplicationController extends Controller {
    columns = A([
        {
            valuePath: 'date',
            name: 'Date',
            isFixedLeft: true,
            width: 100,
            staticWidth: 100
        },
        {
            valuePath: 'name',
            name: 'Name',
            isFixedLeft: false,
            width: 100,
            staticWidth: 200
        },
        {
            valuePath: 'age',
            name: 'Age',
            isFixedLeft: false,
            textAlign: 'right',
            width: 100,
            staticWidth: 200
        },
        {
            valuePath: 'tall',
            name: 'Tall',
            width: 100,
            staticWidth: 200
        }
    ]);

    data = [
        {
            date: '1/1/2020',
            name: 'Frodo Baggins',
            age: 150,
            tall: false
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey',
            age: 145,
            tall: true
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
