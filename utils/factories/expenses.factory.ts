import { faker } from '@faker-js/faker';

interface ExpenseDataParams {
    mileageMin?: number;
    mileageMax?: number;
    litersMin?: number;
    litersMax?: number;
    costMin?: number;
    costMax?: number;
}

export function generateExpenseData({
    mileageMin = 1000,
    mileageMax = 3000,
    litersMin = 10,
    litersMax = 50,
    costMin = 10,
    costMax = 500
}: ExpenseDataParams = {}) {
    return {
        mileage: String(faker.number.int({ min: mileageMin, max: mileageMax })),
        numberOfLiters: String(faker.number.int({ min: litersMin, max: litersMax })),
        totalCost: String(faker.number.int({ min: costMin, max: costMax }))
    };
}
