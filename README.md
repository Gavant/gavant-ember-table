# gavant-ember-table

![CI](https://github.com/gavant/gavant-ember-table/actions/workflows/ci.yml/badge.svg)

Data tables built using [ember-table](https://github.com/Addepar/ember-table)

## Compatibility

-   Ember.js v3.28 or above
-   Ember CLI v3.28 or above
-   Node.js v12 or above

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

    },
    {
        valuePath: 'name',
        name: 'Name',
        isFixedLeft: false,
        width: 100,
        maxWidth: 200,
        minWidth: 50
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
                minWidth: 100
            },
            {
                valuePath: 'id',
                cellComponent: 'table/cell/button',
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
