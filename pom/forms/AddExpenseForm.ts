import { expect } from '@playwright/test'
import { BaseForm } from './BaseForm';

export class AddExpenseForm extends BaseForm {

    public readonly formTitle = this.page.locator('.modal-title', { hasText: 'Add an expense' });
    private readonly vehicleDropdown = this.page.locator('#addExpenseCar');
    private readonly reportDateField = this.page.locator('#addExpenseDate');
    public readonly mileageField = this.page.locator('#addExpenseMileage');
    private readonly numberOfLitersField = this.page.locator('#addExpenseLiters');
    public readonly totalCostField = this.page.locator('#addExpenseTotalCost');
    private readonly addExpenseButton = this.page.getByRole('button', { name: 'Add', exact: true });
    public readonly futureDateErrorMessage = this.page.locator('.alert-danger', { hasText: 'Report date has to be less than tomorrow' });
    public readonly lessOrEqualMileageErrorMessage = this.page.locator('.alert-danger', { hasText: 'First expense mileage must not be less or equal to car initial mileage. Car initial mileage is' })
    public readonly wrongLitersErrorMessage = this.page.locator('.invalid-feedback p', {
        hasText: 'Liters has to be from 0.01 to 9999'
    });
    public readonly wrongCostErrorMessage = this.page.locator('.invalid-feedback p', { hasText: 'Total cost has to be from 0.01 to 1000000' })

    async addNewExpense(mileage: string, numberOfLiters: string, totalCost: string, vehicle?: string, reportDate?: string) {
        await expect(this.vehicleDropdown).toBeEnabled();

        if (vehicle) {
            await this.selectVehicle(vehicle);
        }

        if (reportDate) {
            await this.enterReportDate(reportDate);
        }

        await this.enterMileage(mileage);
        await this.enterNumberOfLiters(numberOfLiters);
        await this.enterTotalCost(totalCost);
        await this.clickAddExpenseButton();
    }

    async selectVehicle(vehicle: string) {
        await this.vehicleDropdown.selectOption(vehicle);
    }

    async enterReportDate(reportDate: string) {
        await this.reportDateField.fill(reportDate);
    }

    async enterMileage(mileage: string) {
        await this.mileageField.fill(mileage);
    }

    async enterNumberOfLiters(numberOfLiters: string) {
        await this.numberOfLitersField.fill(numberOfLiters);
    }

    async enterTotalCost(totalCost: string) {
        await this.totalCostField.fill(totalCost);
        await this.totalCostField.blur();
    }

    async clickAddExpenseButton() {
        await this.addExpenseButton.click();
    }

}