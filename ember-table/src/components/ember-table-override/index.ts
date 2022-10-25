// import EmberTbodyComponent from 'components/ember-tbody-override';
// import EmberTableLoadingMore from 'ember-table/components/ember-table-loading-more/component';
import EmberTable, { Column, ColumnMeta } from 'ember-table/components/ember-table/component';

// // import EmberTableCell from 'ember-table/components/ember-td/component';
// // import EmberTableFooter, { EmberTableFooterSignature } from 'ember-table/components/ember-tfoot/component';
// import EmberTableHeader from 'ember-table/components/ember-thead/component';
// // import EmberTableRow from 'ember-table/components/ember-tr/component';
// import { WithBoundArgs } from '@glint/template';
import { setupTableStickyPolyfill, teardownTableStickyPolyfill } from '../../-private/sticky/table-sticky-polyfill';

// interface OverridenFooterSignature<CV extends Column<CV, RV, M, CM, RM, TM>, RV, M, CM extends ColumnMeta, RM, TM> {
//     Args: EmberTableFooterSignature<CV, RV, M, CM, RM, TM>['Args'];
//     Blocks: {
//         default: [
//             {
//                 cells: EmberTableCell<CV, RV, M, CM, RM, TM>[];
//                 isHeader: boolean;
//                 rowsCount: number;
//                 row: WithBoundArgs<typeof EmberTableRow, 'api'>;

//                 cells: EmberTableCell<CV, RV, M, CM, RM, TM>[];
//                 isHeader: boolean;
//                 rowsCount: number;
//                 row: WithBoundArgs<typeof EmberTableRow, 'api'>;
//             }
//         ];
//     };
//     Element: EmberTableFooterSignature<CV, RV, M, CM, RM, TM>['Element'];
// }

// interface OverrideSignature<CV extends Column<CV, RV, M, CM, RM, TM>, RV, M, CM extends ColumnMeta, RM, TM> {
//     Args: {
//         tableClasses?: string;
//         tableId?: string;
//         headerStickyOffset?: number;
//         footerStickyOffset?: number;
//     };

//     Blocks: {
//         default: [
//             {
//                 api: any;
//                 head: WithBoundArgs<typeof EmberTableHeader, 'api'>;
//                 body: WithBoundArgs<typeof EmberTbodyComponent, 'api'>;
//                 foot: any;
//                 loadingMore: WithBoundArgs<typeof EmberTableLoadingMore, 'api'>;
//             }
//         ];
//     };
//     Element: EmberTableSignature<CV, RV, M, CM, RM, TM>['Element'];
// }

export default class EmberTableOverrideComponent<
    CV extends Column<RV, M, CM, RM, TM>,
    RV,
    M,
    CM extends ColumnMeta,
    RM,
    TM
> extends EmberTable<CV, RV, M, CM, RM, TM> {
    headerStickyOffset = 0;
    footerStickyOffset = 0;

    /**
     * Reimplements base didInsertElement() w/sticky offset params
     * @see https://github.com/Addepar/ember-table/blob/v2.2.3/addon/components/ember-table/component.js#L45
     */
    didInsertElement() {
        // eslint-disable-next-line prefer-rest-params
        super.didInsertElement();
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
            teardownTableStickyPolyfill(thead);
        }

        if (tfoot) {
            teardownTableStickyPolyfill(tfoot);
        }
        // eslint-disable-next-line prefer-rest-params
        super.willDestroyElement();
    }
}
