import { Column, ColumnValueType } from 'components/table';

/**
 * Turns the columns into the correct types for the table, so that we can have cell components automatically get the correct types.
 * We convert whats sent in from an array to a tuple, so that the values can be accessed by index and we can have the correct types and specifically a hardcoded value id
 *
 *
 * @export
 * @template T
 * @template CV
 * @param {[...T]} items
 * @return {*}
 */
export default function makeColumns<
    T extends ReadonlyArray<Column<ValuePath extends string ? ValuePath : never, any, unknown, any, unknown, unknown>>,
    ValuePath = ColumnValueType<T[number]>
>(items: [...T]) {
    return items;
}
