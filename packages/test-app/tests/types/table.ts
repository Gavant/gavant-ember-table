import Table, { ColumnValue } from '@gavant/ember-table';

import { expectTypeOf } from 'expect-type';

interface items {
    id: string;
    name: string;
}
declare const component: Table<items, unknown, unknown>;
//@ts-ignore
expectTypeOf(component.visibleColumns).toMatchTypeOf<ColumnValue[]>();
