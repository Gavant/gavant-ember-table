import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import type { TestContext } from 'ember-test-helpers';
interface context extends TestContext {
    columns: any[];
}
module('Integration | Component | row/loading', function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (this: context, assert) {
        this.columns = [];
        await render(hbs`<Row::Loading @columns={{this.columns}} />`);
        assert.dom('tr').exists();
    });
});
