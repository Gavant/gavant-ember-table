import Table from '@gavant/ember-table/components/table';

import { expectTypeOf } from 'expect-type';

interface Row {
    id: string;
    name: string;
}

const columns = [
    {
        valuePath: 'name',
        name: 'Name'
    }
] as const;
declare const component: Table<typeof columns[0], Row, any, unknown, any, unknown, unknown>;
expectTypeOf(component.visibleColumns[0]).toMatchTypeOf<typeof columns[0]>();
