import { click, render, scrollTo, settled } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';
import { TablePage } from 'ember-table/test-support';

import { ColumnValue } from '@gavant/ember-table/components/table';

import { generateRows } from 'dummy/tests/helpers/generate-rows';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | table', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function (this: any) {
        this.set('rows', [{ id: 1, name: 'One' }]);
        const columns: ColumnValue[] = [
            { valuePath: 'id', name: 'ID', width: 300, staticWidth: 300 },
            { valuePath: 'name', name: 'Name', width: 300, staticWidth: 300 },
            { valuePath: 'date', name: 'Date', width: 300, staticWidth: 300 },
            { valuePath: 'test', name: 'Test', width: 300, staticWidth: 300 },
            { valuePath: 'test1', name: 'Test1', width: 300, staticWidth: 300 },
            { valuePath: 'test2', name: 'Test2', width: 300, staticWidth: 300 }
        ];
        this.set('columns', columns);
    });

    test('No results message when no rows passed in', async function (assert) {
        this.set('rows', []);
        this.set('columns', []);
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}}/>`);

        assert.equal(this.element.textContent?.trim(), 'No results found');
    });

    test('Custom no results message visible', async function (assert) {
        const noResultsText = 'No results fooooool';
        this.set('rows', []);
        this.set('columns', []);
        this.set('noResultsText', noResultsText);
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @noResultsText={{this.noResultsText}}/>`);

        assert.equal(this.element.textContent?.trim(), noResultsText);
    });

    test('Rows are rendered correctly', async function (assert) {
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} />`);

        const table = new TablePage();
        assert.equal(table.headers.length, 2, 'renders the correct number of columns');
        assert.equal(table.rows.length, 1, 'renders the correct number of rows');
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

    test('Not all columns are shown if in small screen', async function (assert) {
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} />`);

        assert.dom('th').exists({ count: 2 });
    });

    test('Different columns are shown if column arrow is clicked', async function (this: any, assert) {
        const columns = this.columns;
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} />`);

        assert.dom('.data-table-col-pan-btn-right').exists();
        const thElements = document.querySelectorAll('th');
        thElements.forEach((th, index) => {
            assert.dom(th).containsText(columns[index].name);
        });

        await click('.data-table-col-pan-btn-right');

        const newThElements = document.querySelectorAll('th');
        newThElements.forEach((th, index) => {
            assert.dom(th).containsText(columns[index + 1].name);
        });
        assert.dom('.data-table-col-pan-btn-right').exists();
        assert.dom('.data-table-col-pan-btn-left').exists();
    });

    test('Pages down correctly', async function (this: any, assert) {
        const rowCount = 10;
        this.set('loadMoreRows', () => {
            return new Promise((resolve) => {
                const items = [{ id: 'test', name: 'Test' }];
                this.set('rows', [...this.rows, ...items]);
                this.set('hasMoreRows', false);
                resolve(this.rows);
            });
        });
        this.set('hasMoreRows', true);
        this.set('rows', generateRows(rowCount));
        await render(
            hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @loadMoreRows={{this.loadMoreRows}} @hasMoreRows={{this.hasMoreRows}} />`
        );

        const table = new TablePage();
        table.setContext(this);

        assert.equal(table.rows.length, 10);
        const container = document.querySelector('#ember-testing-container');
        if (container) {
            await scrollTo(container, 0, 1000);
        }

        await settled();

        assert.equal(table.rows.length, 11);

        assert.equal(table.getCell(table.rows.length - 1, 0).text.trim(), 'test', 'correct last row rendered');
    });

    test('Pages up correctly', async function (this: any, assert) {
        const rowCount = 10;
        this.set('loadPreviousRows', () => {
            return new Promise((resolve) => {
                const items = [{ id: 'test', name: 'Test' }];
                this.set('rows', [...items, ...this.rows]);
                this.set('hasMoreRows', false);
                resolve(this.rows);
            });
        });
        this.set('hasMoreRows', true);
        this.set('rows', generateRows(rowCount));
        this.set('idForFirstItem', this.rows[5].id);

        await render(
            hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @loadPreviousRows={{this.loadPreviousRows}} @hasMoreRows={{this.hasMoreRows}} @idForFirstItem={{this.idForFirstItem}} @key="id" />`
        );

        const table = new TablePage();
        table.setContext(this);

        assert.equal(table.rows.length, 5);
        const container = document.querySelector('#ember-testing-container');
        if (container) {
            await scrollTo(container, 0, -1000);
        }

        await settled();

        assert.equal(table.rows.length, 11);
        assert.equal(table.getCell(0, 0).text.trim(), 'test', 'correct first row rendered');
    });

    test('headerStickyOffset works', async function (assert) {
        const offset = 50;
        this.set('offset', offset);
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @headerStickyOffset={{this.offset}}/>`);

        const thElements = document.querySelectorAll('th');
        thElements.forEach((th) => {
            assert.dom(th).hasStyle({
                top: `${offset}px`,
                position: 'sticky'
            });
        });
    });

    test('footerStickyOffset works', async function (assert) {
        const offset = 50;
        this.set('offset', offset);
        this.set('footerRows', [{ name: 500 }]);
        await render(
            hbs`<Table @rows={{this.rows}} @columns={{this.columns}}  @footerRows={{this.footerRows}} @footerStickyOffset={{this.offset}} />`
        );

        const footer = document.querySelector('tfoot');
        const footerElements = footer?.querySelectorAll('td') ?? [];
        footerElements.forEach((td: Element) => {
            assert.dom(td).hasStyle({
                bottom: `${offset}px`,
                position: 'sticky'
            });
        });
    });

    test('tableHeight works with string', async function (assert) {
        const height = '200px';
        this.set('height', height);
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @tableHeight={{this.height}} />`);

        const table = document.querySelector('[data-test-ember-table]');
        assert.dom(table).hasStyle({
            height: height
        });
    });

    test('tableHeight works with number', async function (assert) {
        const height = 200;
        this.set('height', height);
        await render(hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @tableHeight={{this.height}} />`);

        const table = document.querySelector('[data-test-ember-table]');
        assert.dom(table).hasStyle({
            height: `${height}px`
        });
    });

    test('custom table class works', async function (assert) {
        const customTableClass = 'my-custom-table-class';
        this.set('customTableClass', customTableClass);
        await render(
            hbs`<Table @rows={{this.rows}} @columns={{this.columns}} @tableClass={{this.customTableClass}} />`
        );

        const tableContainer = document.querySelector('[data-test-ember-table-overflow]');
        assert.dom(tableContainer).hasClass(customTableClass);
    });
});
