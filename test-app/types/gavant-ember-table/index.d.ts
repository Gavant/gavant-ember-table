import ArrayPrototypeExtensions from '@ember/array/types/prototype-extensions';
declare global {
    interface Array<T> extends ArrayPrototypeExtensions<T> {}
}

export {};
