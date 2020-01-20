import EmberTbody from 'ember-table/components/ember-tbody/component';
// @ts-ignore: Ignore import of compiled template
import layout from '@gavant/ember-table/templates/components/ember-tbody/ember-tbody';

export default class EmberTbodyComponent extends EmberTbody {
    layout = layout;
}
