import '@glint/environment-ember-loose';
import EmberTableOverrideComponent from 'components/ember-table-override';
import EmberTableLoadingMore from 'ember-table/components/ember-table-loading-more/component';
import EmberTableBody from 'ember-table/components/ember-tbody/component';
import EmberTableFooter from 'ember-table/components/ember-tfoot/component';
import EmberTHResizeHandle from 'ember-table/components/ember-th/resize-handle/component';
import EmberTHSortIndicator from 'ember-table/components/ember-th/sort-indicator/component';
import EmberTableHeader from 'ember-table/components/ember-thead/component';

import DidInsertModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-insert';
import DidUpdateModifier from '@gavant/glint-template-types/types/ember-render-modifiers/did-update';
import And from '@gavant/glint-template-types/types/ember-truth-helpers/and';
import Eq from '@gavant/glint-template-types/types/ember-truth-helpers/eq';
import Not from '@gavant/glint-template-types/types/ember-truth-helpers/not';
import Or from '@gavant/glint-template-types/types/ember-truth-helpers/or';

import { OnResizeModifier } from '../src/types/helpers/on-resize';

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'ember-thead': typeof EmberTableHeader;
        'ember-tfoot': typeof EmberTableFooter;
        'ember-tbody-override': typeof EmberTableBody;
        'ember-table-loading-more': typeof EmberTableLoadingMore;
        'EmberTablePrivate::ScrollIndicators': any;
        EmberTableOverride: typeof EmberTableOverrideComponent;
        'EmberTh::SortIndicator': typeof EmberTHSortIndicator;
        'EmberTh::ResizeHandle': typeof EmberTHResizeHandle;
        'did-insert': typeof DidInsertModifier;
        'did-update': typeof DidUpdateModifier;
        'on-resize': typeof OnResizeModifier;
        and: typeof And;
        eq: typeof Eq;
        or: typeof Or;
        not: typeof Not;
    }
}
