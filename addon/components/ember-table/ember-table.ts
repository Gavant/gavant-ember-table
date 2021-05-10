import EmberTable from 'ember-table/components/ember-table/component';

import {
    setupTableStickyPolyfill,
    teardownTableStickyPolyfill
} from '@gavant/ember-table/-private/sticky/table-sticky-polyfill';
// @ts-ignore: Ignore import of compiled template
import layout from '@gavant/ember-table/templates/components/ember-table/ember-table';

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
