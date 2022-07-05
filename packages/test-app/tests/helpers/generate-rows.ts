import { faker } from '@faker-js/faker';

export function generateRows(number: number) {
    return [...Array(number)].map(() => {
        return {
            id: faker.datatype.uuid(),
            name: faker.name.firstName()
        };
    });
}
