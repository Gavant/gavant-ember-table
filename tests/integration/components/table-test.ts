import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | table', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        this.set('rows', []);
        this.set('columns', []);

        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}}/>`);

        assert.equal(this.element.textContent?.trim(), 'No results found');
    });
});
