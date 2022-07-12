let SelectionMode;

(function (SelectionMode) {
  SelectionMode["NONE"] = "none";
  SelectionMode["SINGLE"] = "single";
  SelectionMode["MULTIPLE"] = "multiple";
})(SelectionMode || (SelectionMode = {}));

let FillMode;

(function (FillMode) {
  FillMode["EQUAL"] = "equal-column";
  FillMode["FIRST"] = "first-column";
  FillMode["LAST"] = "last-column";
  FillMode["NTH"] = "nth-column";
})(FillMode || (FillMode = {}));

let ResizeMode;

(function (ResizeMode) {
  ResizeMode["STANDARD"] = "standard";
  ResizeMode["FLUID"] = "fluid";
})(ResizeMode || (ResizeMode = {}));

let WidthConstraint;

(function (WidthConstraint) {
  WidthConstraint["NONE"] = "none";
  WidthConstraint["EQUAL"] = "eq-container";
  WidthConstraint["GREATER_THAN"] = "gte-container";
  WidthConstraint["LESS_THAN"] = "lte-container";
})(WidthConstraint || (WidthConstraint = {}));

export { FillMode, ResizeMode, SelectionMode, WidthConstraint };
