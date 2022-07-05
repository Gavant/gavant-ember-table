export enum SelectionMode {
    NONE = 'none',
    SINGLE = 'single',
    MULTIPLE = 'multiple'
}

export enum FillMode {
    EQUAL = 'equal-column',
    FIRST = 'first-column',
    LAST = 'last-column',
    NTH = 'nth-column'
}

export enum ResizeMode {
    STANDARD = 'standard',
    FLUID = 'fluid'
}

export enum WidthConstraint {
    NONE = 'none',
    EQUAL = 'eq-container',
    GREATER_THAN = 'gte-container',
    LESS_THAN = 'lte-container'
}
