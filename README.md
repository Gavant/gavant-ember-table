# gavant-ember-table

![CI](https://github.com/gavant/gavant-ember-table/actions/workflows/ci.yml/badge.svg)

Data tables built using [ember-table](https://github.com/Addepar/ember-table)

## Compatibility

-   Ember.js v3.16 or above
-   Ember CLI v2.13 or above
-   Node.js v10 or above

```
ember install @gavant/ember-table
```

## Usage

To use the addon styles, you must use SASS:

```
ember install ember-cli-sass
```

(Upon addon installation, an import statement will be added to your `app.scss`)

A minimalist table can be created in the following way:

Template

```
<Table
    @columns={{this.columns}}
    @rows={{this.rows}}
/>
```

Where the `rows` and `columns` are arrays that follow this pattern:

Component

```
columns = [
    {
        valuePath: 'date',
        name: 'Date',
        isFixedLeft: true,
        width: 200,
        staticWidth: 200
    },
    {
        valuePath: 'name',
        name: 'Name',
        isFixedLeft: false,
        width: 100,
        staticWidth: 100,
        maxWidth: 100,
        minWidth: 100
    }
]

rows = [
    {
        date: '1/1/2020',
        name: 'Frodo Baggins'
    },
    {
        date: '1/1/2021',
        name: 'Gandalf the Grey'
    }
];
```

It is important to note that `staticWidth` is a property that is used to calculate column visibility at different breakpoints and is **required** on each column object.

A `footerRows` array can be used as an argument as well, often containing table metadata.

Template

```
<Table
    @columns={{this.columns}}
    @rows={{this.rows}}
    @footerRows={{this.footerRows}}
/>
```

Component

```
footerData = [
    { age: 295 }
];
```

Other optional configurations:

@**attribute** { **type**: **defaultValue** } - **description**

```
@tableMeta {hash: {} } - A table meta object that is passed to every table component, allowing access from anywhere.

@bufferSize {number: 0} - Used by the table's <VerticalCollection> to render rows before and after the visible collection.
@containerSelector {string: 'body} - The selector used by <VerticalCollection> to calculate occulsion rendering. Set this to `null` for fixed height/scrollable tables.
@constrainColumnsToFit {boolean: true} - Forces the columns to fit within the table container on any column visibility update.
@enableReorder {boolean: false} - Enable/disable column re-ordering.
@enableSort {boolean: false} - Enable/disable row sorting.
@enableUserResize {boolean: false} - Enable/disable column re-sizing. Note: Column objects with max/min widths will not be resizable.
@estimateRowHeight {number: 30} - Used by <VerticalCollection> to estimate the row height when rendering.
@fillColumnIndex {number | null : null} - The column index of the column that will receive any un-allocated width.
@fillMode {string: 'first-column'} - The fill mode used by Ember Table to allocate additional width.
@footerRows {array<any>: []} - The footer rows to be displayed. i.e. for a table with a 'subtotal' column:

    footerRows: { subtotal:500};

@hasMoreRows {boolean: false} - A boolean used to indicate if the table should invoke @loadMoreRows.
@hoverableRows {boolean: true} - Enable/disable hoverable rows.
@isLoading {boolean: false} - Will display a progress spinner within the table when true.
@noResultsText {string: 'No results found'} - Displayed when there are no rows.
@panButtonClass {string: 'btn btn-secondary'} - The class given to the pan-buttons when there are hidden columns.
@renderAllRows {boolean: false} - Used by <VerticalCollection> to determine if all rows should be rendered.
@resizeDebounce {number: 250} - The debounce time used by the resize listener to update column visibility.
@resizeMode {string: 'standard'} - The resize mode used by EmberTable when resizing columns. Note: @enableUserResize must be true.
@resizeWidthSensitive {boolean: true} - Enable/disable column visibility updates on width resizing.
@showEmptyFooter {boolean: false} - Enable/disable the footer when empty.
@showHeader {boolean: true} - Enable/disable the table header.
@small {boolean: true} - Appends 'table-sm' to the table class when true.
@sortEmptyLast {boolean: false} - When enabled, empty column values will always be sorted last.
@stripedRows {boolean: false} - Enable/disabled striped rows.
@tableClass {string: 'table'} - The class for the EmberTable.
@tableHeight {string: ''} - The height style given to the table. i.e. '300px'
@widthConstraint {string: 'lte-container'} - The width constraint used by EmberTable.
@headerStickyOffset {number: 0} - When column headers are "sticky", this sets their offset (in pixels) from the top of the scrollable container
@footerStickyOffset {number: 0} - When column footers are "sticky", this sets their offset (in pixels) from the bottom of the scrollable container

@loadMoreRows {() => any: null} - A method that updates the rows array when isLoading is false, hasMoreRows is true, and the user has reached the bottom of the table.
@loadPreviousRows {() => any: null} - A method that updates the rows array when isLoading is false, hasMoreRows is true, and the user has reached the top of the table.
@onRowClick {()=> any: null} - The method triggered on row click.
@onRowDoubleClick {()=> any: null} - The method triggered on row double click.
```

##### Using the Expandable Row Component

The following is a basic implementation of the expandable-row component pattern.

###### Controller

```
export default class FooController extends Controller {
    ...

    @tracked expandedRows = [];

    get columns() {
        return [
            {
                valuePath: 'name',
                name: 'Name',
                isFixedLeft: false,
                width: 100,
                staticWidth: 100
            },
            {
                valuePath: 'id',
                cellComponent: 'table/cell/button',
                width: 100,
                staticWidth: 100,
                maxWidth: 100,
                minWidth: 100,
                toggleRow: this.toggleRow
            }
        ];
    }

    @action
    toggleRow(rowValue) {
        const expandedRows = this.expandedRows.concat([]);
        const rowExpanded = expandedRows.includes(rowValue);
        if (rowExpanded) {
            const ind = expandedRows.indexOf(rowValue);
            expandedRows.splice(ind, 1);
        } else {
            expandedRows.push(rowValue);
        }
        this.expandedRows = expandedRows;
    }
}
```

###### Template

```
    <Table
        @columns={{this.columns}}
        ...
        @rowComponent="row/expandable-row"
        @tableMeta={{hash
          expandedRowComponent="custom-row"
          expandedRows=this.expandedRows
        }}
    />
```

###### table/cell/button

```
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TableCellButtonComponent extends Component {
    @action
    onClick(event) {
        event.stopPropagation();
        this.args.columnValue.toggleRow(this.args.rowValue);
    }
}
-------- Template ----------
<button type="button" {{on "click" this.onClick}}>Expand Row</button>
```

###### components/custom-row

```
<div class="d-flex flex-row justify-content-around">
    <div class="d-flex">
        {{@tableMeta.foo}}
    </div>
    <div class="alert alert-primary" role="alert">
        Pass in necessary things through the tableMeta hash! {{@tableMeta.bar}}
    </div>
    <div class="d-flex">
        Look I have access to rowValue here! {{@rowValue.name}}
    </div>
</div>
<div class="d-flex flex-row justify-content-between">
    <span class="badge badge-primary">I can also access the TBody api {{@api.rowMeta.prev}}</span>
</div>
```

More configuration options and api details can be found here: [ember-table](https://github.com/Addepar/ember-table) - [vertical-collection](https://html-next.github.io/vertical-collection/)

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
