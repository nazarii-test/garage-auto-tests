import { BaseForm } from './BaseForm';

export class EditProfileForm extends BaseForm {
    private readonly nameField = this.page.locator('#editProfileName');
    private readonly lastNameField = this.page.locator('#editProfileLastName');
    private readonly countryField = this.page.locator('#editProfileCountry');
    private readonly birthdayField = this.page.locator('#editProfileDateBirth');
    private readonly photoField = this.page.locator('input#editProfilePhoto');
    private readonly saveButton = this.page.getByRole('button', { name: 'Save' });
    public readonly emptyNameErrorMessage = this.page.locator('.invalid-feedback p', { hasText: 'Name is required' });
    public readonly emptyLastNameErrorMessage = this.page.locator('.invalid-feedback p', { hasText: 'Last name is required' });
    public readonly invalidCountryErrorMessage = this.page.locator('.invalid-feedback p', { hasText: 'Country is invalid' });
    public readonly invalidLengthCountryErrorMessage = this.page.locator('.invalid-feedback p', { hasText: 'Country has to be from 2 to 20 characters long' });

    async enterName(name: string) {
        await this.nameField.fill(name);
        await this.nameField.blur();
    }

    async enterLastName(lastName: string) {
        await this.lastNameField.fill(lastName);
        await this.lastNameField.blur();
    }

    async enterCountry(country: string) {
        await this.countryField.fill(country);
        await this.countryField.blur();
    }

    async enterBirthday(birthday: string) {
        await this.birthdayField.fill(birthday);
    }

    async addPhoto(imagePath: string) {
        await this.photoField.setInputFiles(imagePath);
    }

    async clickSaveButton() {
        await this.saveButton.click();
    }

}