import { test, expect } from "@playwright/test";
import { testUser1 } from "../../test-data/validUsers";
import GarageService from "../../utils/api/services/GarageServices";
import AuthService from "../../utils/api/services/AuthService";

let garageService: GarageService;
let authService: AuthService;

test.beforeEach(({ request }) => {
    garageService = new GarageService(request);
})

test.describe("Get brands and model", () => {
    test("Get all brands", async () => {
        const brands = await garageService.getAllBrands();

        expect(brands).toHaveLength(5);
    });

    test("Get all models", async () => {
        const models = await garageService.getAllModels();

        expect(models).toHaveLength(23);
    });

    test("Get model by id", async () => {
        const model = await garageService.getModel(2);
        expect(model.carBrandId).toBe(1);
        expect(model.title).toBe("R8");
    });

    test("Get model by invalid id", async () => {
        const response = await garageService.getModel(53525, false);
        const responseJson = await response.json();

        expect(response.status()).toBe(404);
        expect(responseJson.message).toBe("No car models found with this id");
    });
});



test.describe("Private request", () => {
    let sid: string;

    test.beforeAll(async ({ request }) => {
        authService = new AuthService(request);

        sid = await authService.getAuthCookie(testUser1.email, testUser1.password);
    });

    test.describe("Removing cars", () => {
        let carToRemoveID: number;

        test.beforeAll(async ({ request }) => {
            const newCar = {
                carBrandId: 3,
                carModelId: 11,
                mileage: 123,
            };
            const response = await request.post("/api/cars", {
                data: newCar,
                headers: {
                    cookie: sid,
                },
            });
            const responseJson = await response.json();
            const addedCar = responseJson.data;
            carToRemoveID = addedCar.id;
            console.log(`Added car is: ${addedCar.brand} ${addedCar.model}`);

            expect(response.status()).toBe(201);
        });

        test("Remove a car", async () => {
            const removedCar = await garageService.removeCar(sid, carToRemoveID);

            expect(removedCar.carId).toBe(carToRemoveID);
        });

        test("Remove a car with invalid id", async () => {
            const response = await garageService.removeCar(sid, 6544654, false);
            const responseJson = await response.json();

            expect(response.status()).toBe(404);
            expect(responseJson.message).toBe("Car not found");
        });
    });

test.describe("Adding new cars", () => {
    let addedCarsToRemove: number[] = [];

    test("Add new car - Ford Fiesta", async ({ request }) => {
        const newCar = {
            carBrandId: 3,
            carModelId: 11,
            mileage: 123,
        };
        const response = await request.post("/api/cars", {
            data: newCar,
            headers: {
                cookie: sid,
            },
        });
        const responseJson = await response.json();
        const addedCar = responseJson.data;
        console.log(addedCar);

        expect(response.status()).toBe(201);
        expect(addedCar.carBrandId).toBe(newCar.carBrandId);
        expect(addedCar.carModelId).toBe(newCar.carModelId);
        expect(addedCar.initialMileage).toBe(newCar.mileage);
        expect(addedCar.id).toBeDefined();
        addedCarsToRemove.push(addedCar.id);
    });

    test("Add new car - Audi TT", async ({ request }) => {
        const newCar = {
            carBrandId: 1,
            carModelId: 1,
            mileage: 1000,
        };
        const response = await request.post("/api/cars", {
            data: newCar,
            headers: {
                cookie: sid,
            },
        });
        const responseJson = await response.json();
        const addedCar = responseJson.data;
        console.log(responseJson.data);

        expect(response.status()).toBe(201);
        expect(responseJson.data.carBrandId).toBe(newCar.carBrandId);
        expect(responseJson.data.carModelId).toBe(newCar.carModelId);
        expect(responseJson.data.id).toBeDefined();
        addedCarsToRemove.push(addedCar.id);
    });

    test.afterAll(async ({ request }) => {
        for (const id of addedCarsToRemove) {
            const response = await request.delete(`/api/cars/${id}`, {
                headers: {
                    cookie: sid,
                },
            });
            console.log(await response.json());

            expect(response.status()).toBe(200);
        }
    });
});
});





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
