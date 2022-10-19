import EmberTbody, { EmberTableBodySignature } from 'ember-table/components/ember-tbody/component';

type OverridenArgs = EmberTableBodySignature['Args'] & {
    isLoading?: boolean;
    showBottomLoading?: boolean;
    showTopLoading?: boolean;
    isEmpty?: boolean;
    noResultsText?: string;
};

interface OverridenSignature {
    Args: OverridenArgs;
    Blocks: EmberTableBodySignature['Blocks'];
    Element: EmberTableBodySignature['Element'];
}
export default interface EmberTbodyComponent extends OverridenArgs {}

export default class EmberTbodyComponent extends EmberTbody<OverridenSignature> {}
