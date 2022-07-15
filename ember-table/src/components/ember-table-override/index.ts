import EmberTable from 'ember-table/components/ember-table/component';

import { setupTableStickyPolyfill, teardownTableStickyPolyfill } from '../../-private/sticky/table-sticky-polyfill';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Ignore import of compiled template
import layout from './index.hbs';

export default class EmberTableComponent extends EmberTable {
    layout = layout;
    headerStickyOffset = 0;
    footerStickyOffset = 0;

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
