import Component from '@glimmer/component';

interface ProgressSpinnerArgs {
    active?: boolean;
    light?: boolean;
    size?: 'small' | 'medium' | 'large';
}
export default class ProgressSpinnerComponent extends Component<ProgressSpinnerArgs> {
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
