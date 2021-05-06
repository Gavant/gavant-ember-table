import { setupTest } from 'ember-qunit';

import { module, test } from 'qunit';

module('Unit | Component | table', function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
        const component = this.owner.factoryFor('component:table').create();
        assert.ok(component);
    });
});
