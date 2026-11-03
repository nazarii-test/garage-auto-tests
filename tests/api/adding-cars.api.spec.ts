import test, { expect } from "@playwright/test";
import { testUser1 } from "../../test-data/validUsers";
import GarageService from "../../utils/api/services/GarageService";
import AuthService from "../../utils/api/services/AuthService";
import { generateNewCar } from "../../utils/api/factories/cars.factory";

let garageService: GarageService;
let authService: AuthService;

let sid: string;

test.describe('Adding new cars', () => {

    test.beforeAll(async ({ request }) => {
        authService = new AuthService(request);

        sid = await authService.getAuthCookie(testUser1.email, testUser1.password);
    })

    test.beforeEach(({ request }) => {
        garageService = new GarageService(request);
        authService = new AuthService(request);
    })


    let addedCarsToRemove: string[] = [];

    test('Add new car - Ford Fiesta', async () => {
        const newCar = generateNewCar(3, 11, 123);
        const addedCar = await garageService.addCar(sid, newCar.carBrandId, newCar.carModelId, newCar.mileage);

        expect(addedCar.carBrandId).toBe(newCar.carBrandId);
        expect(addedCar.carModelId).toBe(newCar.carModelId);
        expect(addedCar.initialMileage).toBe(newCar.mileage);
        expect(addedCar.id).toBeDefined();

        addedCarsToRemove.push(addedCar.id);
    })

    test('Add new car - Audi TT', async () => {
        const newCar = generateNewCar(1, 1, 123);

        const addedCar = await garageService.addCar(sid, newCar.carBrandId, newCar.carModelId, newCar.mileage);

        expect(addedCar.carBrandId).toBe(newCar.carBrandId);
        expect(addedCar.carModelId).toBe(newCar.carModelId);
        expect(addedCar.initialMileage).toBe(newCar.mileage);
        expect(addedCar.id).toBeDefined();

        addedCarsToRemove.push(addedCar.id);
    })

    test.afterAll(async ({ request }) => {
        const garageService = new GarageService(request);

        for (const id of addedCarsToRemove) {
            await garageService.removeCar(sid, id);
        }
    })
})


