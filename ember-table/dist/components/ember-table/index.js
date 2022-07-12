import { _ as _defineProperty } from '../../defineProperty-f419f636.js';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';
import EmberTable from 'ember-table/components/ember-table/component';

var TEMPLATE = hbs("{{! template-lint-disable  }}\n<div data-test-ember-table-overflow id=\"{{this.elementId}}-overflow\" class=\"ember-table-overflow\">\n    <table class={{@tableClasses}}>\n        {{yield\n            (hash\n                api=this.api\n                head=(component \"ember-thead\" api=this.api)\n                body=(component \"ember-tbody\" api=this.api)\n                foot=(component \"ember-tfoot\" api=this.api)\n            )\n        }}\n    </table>\n</div>\n{{-ember-table-private/scroll-indicators api=this.api}}");

/* global ResizeSensor */

/* eslint-disable ember/no-observers */

/**
 * @see https://github.com/Addepar/ember-table/blob/v2.2.3/addon/-private/sticky/table-sticky-polyfill.js
 */
const TABLE_POLYFILL_MAP = new WeakMap();

class TableStickyPolyfill {
  constructor(element, _offset) {
    _defineProperty(this, "element", void 0);

    _defineProperty(this, "offset", void 0);

    _defineProperty(this, "maxStickyProportion", void 0);

    _defineProperty(this, "side", void 0);

    _defineProperty(this, "setupRaf", void 0);

    _defineProperty(this, "mutationObserver", void 0);

    _defineProperty(this, "rowMutationObservers", void 0);

    _defineProperty(this, "resizeSensors", void 0);

    _defineProperty(this, "setupRowMutationObservers", () => {
      const rows = Array.from(this.element.children);
      this.rowMutationObservers = rows.map(row => {
        const observer = new MutationObserver(this.repositionStickyElements);
        observer.observe(row, {
          childList: true
        });
        return observer;
      });
    });

    _defineProperty(this, "teardownRowMutationObservers", () => {
      this.rowMutationObservers?.forEach(observer => observer.disconnect());
    });

    _defineProperty(this, "setupResizeSensors", () => {
      const rows = Array.from(this.element.children);
      const firstCells = rows.map(r => r.firstElementChild);
      this.resizeSensors = firstCells.map(cell => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const sensor = new ResizeSensor(cell, this.repositionStickyElements);
        return [cell, sensor];
      });
    });

    _defineProperty(this, "teardownResizeSensors", () => {
      this.resizeSensors?.forEach(([cell, sensor]) => sensor.detach(cell));
    });

    _defineProperty(this, "repositionStickyElements", () => {
      const table = this.element.parentNode;
      const scale = table.offsetHeight / table.getBoundingClientRect().height;
      const containerHeight = table?.parentNode?.offsetHeight;
      const rows = Array.from(this.element.querySelectorAll('tr'));
      let offset = this.offset;
      const heights = rows.map(r => r.getBoundingClientRect().height * scale);
      const totalHeight = heights.reduce((sum, h) => sum += h, 0);
      const maxHeight = containerHeight * this.maxStickyProportion;

      if (totalHeight > maxHeight) {
        offset = maxHeight - totalHeight + this.offset;
      }

      for (let i = 0; i < rows.length; i++) {
        // Work top-down (index order) for 'top', bottom-up (reverse index
        // order) for 'bottom' rows
        const index = this.side === 'top' ? i : rows.length - 1 - i;
        const row = rows[index];
        const height = heights[index];

        for (const child of row.children) {
          child.style.position = '-webkit-sticky';
          child.style.position = 'sticky';
          child.style[this.side] = `${offset}px`;
        }

        offset += height;
      }
    });

    this.element = element;
    this.offset = _offset;
    this.maxStickyProportion = 0.5;
    this.element.style.position = 'static';
    this.side = element.tagName === 'THEAD' ? 'top' : 'bottom';
    this.setupRaf = requestAnimationFrame(this.repositionStickyElements);
    this.setupResizeSensors();
    this.setupRowMutationObservers();
    this.mutationObserver = new MutationObserver(() => {
      this.teardownResizeSensors();
      this.teardownRowMutationObservers();
      this.setupResizeSensors();
      this.setupRowMutationObservers();
      this.repositionStickyElements();
    });
    this.mutationObserver.observe(this.element, {
      childList: true
    });
  }

  destroy() {
    this.element.style.position = 'sticky';
    cancelAnimationFrame(this.setupRaf);
    this.teardownResizeSensors();
    this.teardownRowMutationObservers();
    this.mutationObserver.disconnect();
  }

}

function setupTableStickyPolyfill(element, offset = 0) {
  TABLE_POLYFILL_MAP.set(element, new TableStickyPolyfill(element, offset));
}
function teardownTableStickyPolyfill(element) {
  TABLE_POLYFILL_MAP.get(element).destroy();
  TABLE_POLYFILL_MAP.delete(element);
}

class EmberTableComponent extends EmberTable {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "headerStickyOffset", 0);

    _defineProperty(this, "footerStickyOffset", 0);
  }

  /**
   * Reimplements base didInsertElement() w/sticky offset params
   * @see https://github.com/Addepar/ember-table/blob/v2.2.3/addon/components/ember-table/component.js#L45
   */
  didInsertElement() {
    const thead = this.element.querySelector('thead');
    const tfoot = this.element.querySelector('tfoot');

    if (thead) {
      setupTableStickyPolyfill(thead, this.headerStickyOffset);
    }

    if (tfoot) {
      setupTableStickyPolyfill(tfoot, this.footerStickyOffset);
    }
  }
  /**
   * Reimplements base willDestroyElement() w/sticky offset params
   * @see https://github.com/Addepar/ember-table/blob/v2.2.3/addon/components/ember-table/component.js#L65
   */


  willDestroyElement() {
    const thead = this.element.querySelector('thead');
    const tfoot = this.element.querySelector('tfoot');

    if (thead) {
      teardownTableStickyPolyfill(this.element.querySelector('thead'));
    }

    if (tfoot) {
      teardownTableStickyPolyfill(this.element.querySelector('tfoot'));
    }
  }

}
setComponentTemplate(TEMPLATE, EmberTableComponent);

export { EmberTableComponent as default };
