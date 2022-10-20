import Component from '@glimmer/component';

interface ProgressSpinnerArgs {
    active?: boolean;
    light?: boolean;
    size?: 'small' | 'medium' | 'large';
}

interface ProgressSpinnerSignature {
    Args: ProgressSpinnerArgs;
    Blocks: {
        default: [];
    };
}
export default class ProgressSpinnerComponent extends Component<ProgressSpinnerSignature> {
    classNameBindings: string[] = ['active', 'light', 'size'];

    get active() {
        return this.args.active ?? true;
    }

    get light() {
        return this.args.light ?? false;
    }

    get size() {
        return this.args.size ?? null;
    }
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        ProgressSpinner: typeof ProgressSpinnerComponent;
    }
}
