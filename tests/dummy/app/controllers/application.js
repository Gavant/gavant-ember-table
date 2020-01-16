import Controller from '@ember/controller';

class ApplicationController extends Controller {
    columns = [
        {
            valuePath: 'date',
            name: 'Date',
            isFixedLeft: true,
            width: 100
        },
        {
            valuePath: 'name',
            name: 'Name',
            width: 100
        }
    ];

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
}

export default ApplicationController;
