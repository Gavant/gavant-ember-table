import Component from '@glimmer/component';

interface ProgressSpinnerArgs {
    active: boolean;
    light?: boolean;
    size?: string;
}

export default class ProgressSpinnerComponent extends Component<ProgressSpinnerArgs> {
    get active(): boolean {
        return this.args.active ?? true;
    }

    get light(): boolean {
        return this.args.light ?? false;
    }

    get size(): string {
        return this.args.size ?? '';
    }
}
