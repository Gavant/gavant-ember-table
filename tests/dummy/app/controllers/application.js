import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';

class ApplicationController extends Controller {
    columns = A([
        {
            valuePath: 'date',
            name: 'Date',
            isFixedLeft: true,
            width: 100
        },
        {
            valuePath: 'name',
            name: 'Name',
            isFixedLeft: false,
            width: 100
        }
    ]);

    data = [
        {
            date: '1/1/2020',
            name: 'Frodo Baggins'
        },
        {
            date: '1/1/2021',
            name: 'Gandalf the Grey'
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
