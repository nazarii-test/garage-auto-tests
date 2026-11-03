import { expect } from '@playwright/test'
import { BaseForm } from './BaseForm';

export class EditCarForm extends BaseForm {

    private readonly removeCarButton = this.page.locator('.btn-outline-danger');
    private readonly confirmRemovingButton = this.page.locator('.btn-danger');

    async removeOpenCar() {
        await this.removeCarButton.click();
        await this.confirmRemovingButton.click();
    }
}