import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | table', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function (this: any, assert) {
        this.set('rows', [{ id: 1, name: 'One' }]);
        this.set('columns', [{ valuePath: 'id' }, { valuePath: 'name' }]);
    });

    test('No results message when no rows passed in', async function (assert) {
        this.set('rows', []);
        this.set('columns', []);
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}}/>`);

        assert.equal(this.element.textContent?.trim(), 'No results found');
    });

    test('Table striping class applied correctly', async function (assert) {
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @stripedRows={{true}} />`);

        assert.dom('.ember-table-overflow').hasClass('table-striped');
    });

    test('Hoverable rows class applied correctly', async function (assert) {
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @hoverableRows={{true}} />`);

        assert.dom('.ember-table-overflow').hasClass('table-hover');
    });

    test('Clickable rows class applied correctly via onRowClick', async function (assert) {
        this.set('onRowClick', () => {});
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @onRowClick={{this.onRowClick}} />`);

        assert.dom('.ember-table-overflow').hasClass('table-clickable-rows');
    });

    test('Clickable rows class applied correctly via onRowDoubleClick', async function (assert) {
        this.set('onRowDoubleClick', () => {});
        await render(
            hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @onRowDoubleClick={{this.onRowDoubleClick}} />`
        );
        assert.dom('.ember-table-overflow').hasClass('table-clickable-rows');
    });

    test('Small table class applied correctly', async function (assert) {
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @small={{true}} />`);

        assert.dom('.ember-table-overflow').hasClass('table-sm');
    });

    test('Small table class applied correctly', async function (assert) {
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @small={{true}} />`);

        assert.dom('.ember-table-overflow').hasClass('table-sm');
    });
});
