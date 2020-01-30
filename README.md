# gavant-ember-table

Data tables built using [ember-table](https://github.com/Addepar/ember-table)

## Compatibility

-   Ember.js v3.8 or above
-   Ember CLI v2.13 or above
-   Node.js v10 or above

## Installation

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

```
@isLoading - A boolean that will display a progress spinner within the table when false.
@hasMoreRows - A boolean whether more rows are available that haven't been loaded yet.
@noResultsText - A string displayed when there are no rows. Default - "No results founds"

Note: If both isLoading and hasMoreRows are false, and the rows array is empty, noResultsText will be displayed

@loadMoreRows - A function that updates the rows array when isLoading is false, hasMoreRows is true and the user has reached the bottom of the table.

@updateSorts - A function that updates the sorts array.
@onRowClick - An action that is fired when a row is clicked
@enableSort - A boolean that allows/disallows sorting
```

More configuration options and api details can be found here: [ember-table](https://github.com/Addepar/ember-table).

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
