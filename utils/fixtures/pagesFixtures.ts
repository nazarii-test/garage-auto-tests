import { test as base, Page } from '@playwright/test';
import { GaragePage } from '../../pom/pages/GaragePage';
import { HomePage } from "../../pom/pages/HomePage";
import { SignInForm } from "../../pom/forms/SignInForm";
import { AddCarForm } from "../../pom/forms/AddCarForm";
import { EditCarForm } from '../../pom/forms/EditCarForm';
import { AddExpenseForm } from '../../pom/forms/AddExpenseForm';
import { ExpensesPage } from '../../pom/pages/ExpensesPage';
import { ProfilePage } from '../../pom/pages/ProfilePage';
import { EditProfileForm } from '../../pom/forms/EditProfileForm';

type App = {
    page: Page,
    garagePage: GaragePage;
    homePage: HomePage;
    signInForm: SignInForm;
    addCarForm: AddCarForm;
    editCarForm: EditCarForm;
    addExpenseForm: AddExpenseForm;
    expensesPage: ExpensesPage;
    profilePage: ProfilePage;
    editProfileForm: EditProfileForm;
};

export const test = base.extend<{ app: App }>({
    app: async ({ page }, use) => {
        const app: App = {
            page,
            garagePage: new GaragePage(page),
            homePage: new HomePage(page),
            signInForm: new SignInForm(page),
            addCarForm: new AddCarForm(page),
            editCarForm: new EditCarForm(page),
            addExpenseForm: new AddExpenseForm(page),
            expensesPage: new ExpensesPage(page),
            profilePage: new ProfilePage(page),
            editProfileForm: new EditProfileForm(page)
        };
        await use(app);
    }
});


// export const test = base.extend<Pages>({
//     garagePage: async ({ page }, use) => {
//         const garagePage = new GaragePage(page);
//         await use(garagePage);
//     },
//     homePage: async ({ page }, use) => {
//         const homePage = new HomePage(page);
//         await use(homePage);
//     },
//     signInForm: async ({ page }, use) => {
//         const signInForm = new SignInForm(page);
//         await use(signInForm);
//     },
//     addCarForm: async ({ page, garagePage }, use) => {
//         await garagePage.navigate();
//         await garagePage.openAddCarForm();
//         const addCarForm = new AddCarForm(page);
//         await use(addCarForm);
//     },
//     addCarFormWithRemovingCar: async ({ addCarForm, editCarForm, garagePage }, use) => {
//         await garagePage.navigate();
//         await garagePage.openAddCarForm();
//         await use(addCarForm);
//         await garagePage.openEditCarForm(0);
//         await editCarForm.removeOpenCar();
//         await garagePage.verifyCarIsRemoved();
//     },
//     addCarFormAsUser1: async ({ browser }, use) => {
//         const context = await browser.newContext({
//             storageState: '.states/testuser1.json'
//         });
//         const page = await context.newPage();

//         const garagePage = new GaragePage(page);
//         const addCarForm = new AddCarForm(page);

//         await garagePage.navigate();
//         await garagePage.openAddCarForm();
//         await use(addCarForm);
//         await context.close();
//     },
//     addCarFormAsUser2: async ({ browser }, use) => {
//         const context = await browser.newContext({
//             storageState: '.states/testuser2.json'
//         });
//         const page = await context.newPage();

//         const garagePage = new GaragePage(page);
//         const addCarForm = new AddCarForm(page);

//         await garagePage.navigate();
//         await garagePage.openAddCarForm();
//         await use(addCarForm);
//         await context.close();
//     },
//     editCarForm: async ({ page }, use) => {
//         const editCarForm = new EditCarForm(page);
//         await use(editCarForm);
//     },
// });
export { expect } from '@playwright/test';