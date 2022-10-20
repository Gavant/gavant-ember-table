import Modifier from 'ember-modifier';

interface OnResizeSignature<Element extends HTMLElement | SVGElement, Args extends any[]> {
    Args: {
        Positional: [(element: Element, args: Args) => any, ...Args];
        Named: {
            debounce?: number;
        };
    };
    Element: Element;
}

// TODO: Can we avoid setting the default?
export declare class OnResizeModifier<Element extends HTMLElement | SVGElement, Args extends any[]> extends Modifier<
    OnResizeSignature<Element, Args>
> {}
