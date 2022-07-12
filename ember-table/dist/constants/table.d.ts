declare enum SelectionMode {
    NONE = "none",
    SINGLE = "single",
    MULTIPLE = "multiple"
}
declare enum FillMode {
    EQUAL = "equal-column",
    FIRST = "first-column",
    LAST = "last-column",
    NTH = "nth-column"
}
declare enum ResizeMode {
    STANDARD = "standard",
    FLUID = "fluid"
}
declare enum WidthConstraint {
    NONE = "none",
    EQUAL = "eq-container",
    GREATER_THAN = "gte-container",
    LESS_THAN = "lte-container"
}
export { SelectionMode, FillMode, ResizeMode, WidthConstraint };
