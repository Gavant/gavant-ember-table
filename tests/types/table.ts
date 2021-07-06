import NativeArray from '@ember/array/-private/native-array';

import Table, { ColumnValue } from '@gavant/ember-table/components/table';

import { expectTypeOf } from 'expect-type';

interface items {
    id: string;
    name: string;
}
declare const component: Table<items, unknown, unknown>;
expectTypeOf(component.visibleColumns).toMatchTypeOf<NativeArray<ColumnValue>>();
