declare module 'ember-table/components/ember-tfoot/component' {
    // eslint-disable-next-line ember/no-classic-components
    import Component from '@ember/component';

    import EmberTableCell from 'ember-table/components/ember-td/component';
    import EmberTableRow from 'ember-table/components/ember-tr/component';

    import { WithBoundArgs } from '@glint/template';

    export interface EmberTableFooterSignature {
        Args: {
            tableClasses?: string;
            api: any;
            rows: any[];
        };
        Blocks: {
            default: [
                {
                    cells: EmberTableCell[];
                    isHeader: boolean;
                    rowsCount: number;
                    row: WithBoundArgs<typeof EmberTableRow, 'api'>;
                }
            ];
        };

        Element: HTMLDivElement;
    }

    export default class EmberTableFooter<
        T extends EmberTableFooterSignature
        // eslint-disable-next-line ember/require-tagless-components
    > extends Component<T> {}
}
