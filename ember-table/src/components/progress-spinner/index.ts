import Component from '@glimmer/component';

export default class ProgressSpinnerComponent extends Component {
    classNames: string[] = ['progress-spinner'];
    classNameBindings: string[] = ['active', 'light', 'size'];
    active: boolean = true;
    light: boolean = false;
    size: string | null = null;
}
