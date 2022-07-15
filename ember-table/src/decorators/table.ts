export function argDefault(_target: any, propertyKey: string, descriptor?: any): any {
    return {
        get(this: any): any {
            return this.args[propertyKey] ?? descriptor.initializer();
        }
    };
}
