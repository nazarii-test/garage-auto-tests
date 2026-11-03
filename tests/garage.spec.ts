import { expect } from "@playwright/test";
import { test } from "../utils/fixtures/pagesFixtures";

import GarageService from "../utils/api/services/GarageService";
import { getSidFromStorageState } from "../utils/storageState/storageState";
let garageService: GarageService;

test.describe('Garage tests', () => {

    test.use({ storageState: '.states/testuser1.json' });

    test.beforeEach(async ({ app }) => {
        await app.garagePage.navigate();
        await app.garagePage.openAddCarForm();
    })

    test.describe('Adding cars', () => {
        test('Add new car - BMW X5', async ({ app }) => {
            await app.addCarForm.addNewCar('BMW', 'X5', '999');
            await app.garagePage.verifyCarIsAdded('BMW X5', '999');
        })

        test('Add new car - Audi Q7', async ({ app }) => {
            await app.addCarForm.addNewCar('Audi', 'Q7', '999');
            await app.garagePage.verifyCarIsAdded('Audi Q7', '999');
        })

        test.afterEach(async ({ request }) => {
            garageService = new GarageService(request);
            const sid = getSidFromStorageState('.states/testuser1.json');
            const allAddedCars = await garageService.getUserCars(sid);
            const lastAddedCarId = allAddedCars.data[0].id;
            await garageService.removeCar(sid, lastAddedCarId);
        })
    })

    test('Add new car without mileage', async ({ app }) => {
        await app.addCarForm.selectBrand('BMW');
        await app.addCarForm.selectModel('X5');
        await expect(app.addCarForm.addCarButton).toBeDisabled();
    })

    test('Close "Add a car" form via "Cancel" button', async ({ app }) => {
        await app.addCarForm.clickCancelButton();
        await expect(app.addCarForm.formTitle).not.toBeVisible();
    })

    test('Close "Add a car" form via close icon', async ({ app }) => {
        await app.addCarForm.clickCloseIcon();
        await expect(app.addCarForm.formTitle).not.toBeVisible();
    })

})