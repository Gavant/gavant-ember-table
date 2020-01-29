import EmberTable from 'ember-table/components/ember-table/component';
// @ts-ignore: Ignore import of compiled template
import layout from '@gavant/ember-table/templates/components/ember-table/ember-table';

export default class EmberTableComponent extends EmberTable {
    layout = layout;
}
