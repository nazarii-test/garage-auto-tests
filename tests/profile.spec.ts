import { expect, test } from "../utils/fixtures/pagesFixtures";
import { faker } from '@faker-js/faker';
import path from 'path';

const __dirname = path.dirname(__filename);

test.describe('Editing Profile tests', () => {

    test.use({ storageState: '.states/testuser2.json' });

    test.beforeEach(async ({ app }) => {
        await app.profilePage.navigate();
        await app.profilePage.openEditProfileForm();
    })

    test('Change name', async ({ app }) => {
        const newName = faker.person.firstName();

        await app.editProfileForm.enterName(newName);
        await app.editProfileForm.clickSaveButton();

        await expect(app.profilePage.profileName).toContainText(newName);
    })

    test('Change last name', async ({ app }) => {
        const lastName = faker.person.lastName();

        await app.editProfileForm.enterLastName(lastName);
        await app.editProfileForm.clickSaveButton();

        await expect(app.profilePage.profileName).toContainText(lastName);
    })

    test('Add photo', async ({ app }) => {
        const photoPath = path.join(__dirname, '..', 'test-data', 'images', 'photo-cat.jpg');

        await app.editProfileForm.addPhoto(photoPath);
        await app.editProfileForm.clickSaveButton();

        await expect(app.profilePage.profilePhoto).not.toHaveAttribute('src', 'https://qauto.forstudy.space/public/images/users/default-user.png');
    })

    test('Add country', async ({ app }) => {
        const country = 'newCountry';

        await app.editProfileForm.enterCountry(country);
        await app.editProfileForm.clickSaveButton();

        await expect(app.profilePage.profileCountry).toHaveText(country);
    })

    test('Add Birthdate', async ({ app }) => {
        const pastDate = faker.date.past().toISOString();

        const year = pastDate.slice(0, 4);
        const month = pastDate.slice(5, 7);
        const day = pastDate.slice(8, 10);

        const fullDate = `${day}.${month}.${year}`;

        await app.editProfileForm.enterBirthday(fullDate);
        await app.editProfileForm.clickSaveButton();

        await expect(app.profilePage.profileBirthday).toHaveText(fullDate);
    })

    test('Validation - empty name', async ({ app }) => {
        await app.editProfileForm.enterName('');

        await expect(app.editProfileForm.emptyNameErrorMessage).toBeVisible();
    })

    test('Validation - empty last name', async ({ app }) => {
        await app.editProfileForm.enterLastName('');

        await expect(app.editProfileForm.emptyLastNameErrorMessage).toBeVisible();
    })

    test('Validation - empty country (with space) ', async ({ app }) => {
        await app.editProfileForm.enterCountry(' ');

        await expect(app.editProfileForm.invalidCountryErrorMessage).toBeVisible();
        await expect(app.editProfileForm.invalidLengthCountryErrorMessage).toBeVisible();
    })
})