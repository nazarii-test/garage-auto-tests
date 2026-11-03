import test, { expect } from "@playwright/test";
import { testUser1 } from "../../test-data/validUsers";
import GarageService from "../../utils/api/services/GarageService";
import AuthService from "../../utils/api/services/AuthService";
import { generateNewCar } from "../../utils/api/factories/cars.factory";

let garageService: GarageService;
let authService: AuthService;

let sid: string;

test.describe('Removing cars', () => {
    test.beforeEach(({ request }) => {
        garageService = new GarageService(request);
        authService = new AuthService(request);
    })

    test.beforeAll(async ({ request }) => {
        authService = new AuthService(request);

        sid = await authService.getAuthCookie(testUser1.email, testUser1.password);
    })

    let carToRemoveId: string;

    test.beforeAll(async ({ request }) => {
        garageService = new GarageService(request);

        const newCar = generateNewCar(1, 1, 123);

        const addedCar = await garageService.addCar(sid, newCar.carBrandId, newCar.carModelId, newCar.mileage);
        carToRemoveId = addedCar.id;
    })

    test('Remove a car', async () => {
        const response = await garageService.removeCar(sid, carToRemoveId);

        expect(response.status()).toBe(200);
    })

    test('Remove a car with invalid id', async () => {
        const response = await garageService.removeCar(sid, '5325325325', true);

        const responseJson = await response.json();

        expect(response.status()).toBe(404);
        expect(responseJson.message).toBe('Car not found');
    })

})


// Remove All Cars
test("Remove all cars", async ({ request }) => {
    const responseAuth = await request.post("/api/auth/signin", {
        data: {
            email: testUser1.email,
            password: testUser1.password,
        },
    });
    const sid = responseAuth.headers()["set-cookie"].split(";")[0];
    expect(responseAuth.status()).toBe(200);

    const responseCars = await request.get("/api/cars", {
        headers: {
            cookie: sid,
        },
    });
    const cars = (await responseCars.json()).data;
    const carIds = cars.map((car: { id: number }) => car.id);
    console.log(`Cars to remove: ${carIds}`);

    for (const carId of carIds) {
        const response = await request.delete(`/api/cars/${carId}`, {
            headers: {
                cookie: sid,
            },
        });
        expect(response.status()).toBe(200);
    }

    const responseAfter = await request.get("/api/cars", {
        headers: {
            cookie: sid,
        },
    });
    expect((await responseAfter.json()).data).toHaveLength(0);
});

