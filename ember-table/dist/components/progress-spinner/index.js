import { _ as _defineProperty } from '../../defineProperty-f419f636.js';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';

var TEMPLATE = hbs("{{yield}}");

class ProgressSpinnerComponent extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "classNames", ['progress-spinner']);

    _defineProperty(this, "classNameBindings", ['active', 'light', 'size']);

    _defineProperty(this, "active", true);

    _defineProperty(this, "light", false);

    _defineProperty(this, "size", null);
  }

}
setComponentTemplate(TEMPLATE, ProgressSpinnerComponent);

export { ProgressSpinnerComponent as default };
