import { Column, ColumnMeta } from 'ember-table/components/ember-table/component';
import EmberTbody, { EmberTableBodySignature } from 'ember-table/components/ember-tbody/component';

type OverridenArgs<
    CV extends Column<RV, M, CM, RM, TM>,
    RV,
    M,
    CM extends ColumnMeta,
    RM,
    TM
> = EmberTableBodySignature<CV, RV, M, CM, RM, TM>['Args'] & {
    isLoading?: boolean;
    showBottomLoading?: boolean;
    showTopLoading?: boolean;
    isEmpty?: boolean;
    noResultsText?: string;
};

interface OverridenSignature<CV extends Column<RV, M, CM, RM, TM>, RV, M, CM extends ColumnMeta, RM, TM> {
    Args: OverridenArgs<CV, RV, M, CM, RM, TM>;
    Blocks: EmberTableBodySignature<CV, RV, M, CM, RM, TM>['Blocks'];
    Element: EmberTableBodySignature<CV, RV, M, CM, RM, TM>['Element'];
}

export default class EmberTbodyComponent<
    CV extends Column<RV, M, CM, RM, TM>,
    RV,
    M,
    CM extends ColumnMeta,
    RM,
    TM
> extends EmberTbody<CV, RV, M, CM, RM, TM, OverridenSignature<CV, RV, M, CM, RM, TM>> {}
