import Route from '@ember/routing/route';
import { A } from '@ember/array';
import { next } from '@ember/runloop';

class TableReversedRoute extends Route {
    model() {
        return A([
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
        ]);
    }

    setupController(controller, model) {
        super.setupController(controller, model);
        next(() => this.scrollToBottom());
    }

    scrollToBottom() {
        //real apps should make sure this is not run in fastboot!
        window.scrollTo(0, document.body.scrollHeight);
    }
}

export default TableReversedRoute;
