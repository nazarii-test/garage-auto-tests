import test, { expect } from '@playwright/test';

// Перед кожним тестом відкриваємо головну сторінку, натискаємо Sign up
// і перевіряємо, що з'явилась форма із заголовком "Registration".
test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.locator('.hero-descriptor_btn').click();
    await expect(page.locator('.modal-title')).toHaveText('Registration');
})

// Скрізь нижче: помилка показується в елементі .invalid-feedback, рамка поля має стати
// червоною rgb(220, 53, 69), а кнопка Register (.modal-footer .btn-primary) має бути вимкнена.
// Email робимо з alias +aqa і Date.now(), щоб при кожному запуску він був унікальним.

// ---------- Позитивні сценарії ----------

test.describe('Registration: positive', () => {

    // Усі поля валідні -> кнопка Register активна -> користувача створено, відкрився Garage.
    // test.slow() збільшує тайм-аут у 3 рази, бо реєстрація на стенді може тривати довше за 5 секунд.
    test('Successful registration', async ({ page }) => {
        test.slow();
        await page.locator('#signupName').fill('Taras');
        await page.locator('#signupLastName').fill('Shevchenko');
        await page.locator('#signupEmail').fill('test+aqa' + Date.now() + '@test.com');
        await page.locator('#signupPassword').fill('Qwerty123');
        await page.locator('#signupRepeatPassword').fill('Qwerty123');
        await expect(page.locator('.modal-footer .btn-primary')).toBeEnabled();
        await page.locator('.modal-footer .btn-primary').click();
        await expect(page).toHaveURL(/panel\/garage/);
    })

    // Мінімально допустимі значення: ім'я і прізвище по 2 символи, пароль 8 символів
    test('Registration with min values', async ({ page }) => {
        test.slow();
        await page.locator('#signupName').fill('Ab');
        await page.locator('#signupLastName').fill('Cd');
        await page.locator('#signupEmail').fill('test+aqa' + Date.now() + '@test.com');
        await page.locator('#signupPassword').fill('Qwerty12');
        await page.locator('#signupRepeatPassword').fill('Qwerty12');
        await page.locator('.modal-footer .btn-primary').click();
        await expect(page).toHaveURL(/panel\/garage/);
    })

    // Максимально допустимі значення: ім'я і прізвище по 20 символів, пароль 15 символів
    test('Registration with max values', async ({ page }) => {
        test.slow();
        await page.locator('#signupName').fill('A'.repeat(20));
        await page.locator('#signupLastName').fill('B'.repeat(20));
        await page.locator('#signupEmail').fill('test+aqa' + Date.now() + '@test.com');
        await page.locator('#signupPassword').fill('Qwerty123456789');
        await page.locator('#signupRepeatPassword').fill('Qwerty123456789');
        await page.locator('.modal-footer .btn-primary').click();
        await expect(page).toHaveURL(/panel\/garage/);
    })

    // За вимогами кнопка Register вимкнена, поки дані некоректні (порожня форма теж некоректна)
    test('Register button is disabled on empty form', async ({ page }) => {
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Хрестик закриває форму реєстрації
    test('Close button closes the form', async ({ page }) => {
        await page.locator('.close').click();
        await expect(page.locator('.modal-title')).not.toBeVisible();
    })
})

// ---------- Name та Last name ----------

test.describe('Registration: Name', () => {

    // Зайшли в поле і вийшли, нічого не ввівши
    test('Name: empty field', async ({ page }) => {
        await page.locator('#signupName').focus();
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name is required');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Вимога: пробіли ігноруються (trim), тож лише пробіли = порожнє поле
    test('Name: only spaces', async ({ page }) => {
        await page.locator('#signupName').fill('   ');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name is required');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Мінімум 2 символи, тому 1 символ — помилка довжини
    test('Name: 1 character', async ({ page }) => {
        await page.locator('#signupName').fill('A');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Максимум 20 символів, тому 21 символ — помилка довжини
    test('Name: 21 characters', async ({ page }) => {
        await page.locator('#signupName').fill('A'.repeat(21));
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Довжина рахується після trim: "  A  " це 1 символ
    test('Name: 1 character with spaces around', async ({ page }) => {
        await page.locator('#signupName').fill('  A  ');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name has to be from 2 to 20 characters long');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Цифри — це не англійські літери
    test('Name: digits', async ({ page }) => {
        await page.locator('#signupName').fill('Taras123');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name is invalid');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Спецсимволи недопустимі
    test('Name: special symbols', async ({ page }) => {
        await page.locator('#signupName').fill('Ab!@#');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name is invalid');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Дозволені лише англійські символи, тому кирилиця — помилка
    test('Name: Ukrainian letters', async ({ page }) => {
        await page.locator('#signupName').fill('Тарас');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Name is invalid');
        await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Валідне значення з пробілами навколо приймається (trim): помилки немає
    test('Name: spaces around valid value are ignored', async ({ page }) => {
        await page.locator('#signupName').fill('  Taras  ');
        await page.locator('#signupName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveCount(0);
    })
})

// ---------- Last name ----------

test.describe('Registration: Last name', () => {

    // Зайшли в поле і вийшли, нічого не ввівши
    test('Last name: empty field', async ({ page }) => {
        await page.locator('#signupLastName').focus();
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name is required');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Вимога: пробіли ігноруються (trim), тож лише пробіли = порожнє поле
    test('Last name: only spaces', async ({ page }) => {
        await page.locator('#signupLastName').fill('   ');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name is required');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Мінімум 2 символи, тому 1 символ — помилка довжини
    test('Last name: 1 character', async ({ page }) => {
        await page.locator('#signupLastName').fill('A');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Максимум 20 символів, тому 21 символ — помилка довжини
    test('Last name: 21 characters', async ({ page }) => {
        await page.locator('#signupLastName').fill('A'.repeat(21));
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Довжина рахується після trim: "  A  " це 1 символ
    test('Last name: 1 character with spaces around', async ({ page }) => {
        await page.locator('#signupLastName').fill('  A  ');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name has to be from 2 to 20 characters long');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Цифри — це не англійські літери
    test('Last name: digits', async ({ page }) => {
        await page.locator('#signupLastName').fill('Shev123');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name is invalid');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Спецсимволи недопустимі
    test('Last name: special symbols', async ({ page }) => {
        await page.locator('#signupLastName').fill('Ab!@#');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name is invalid');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Дозволені лише англійські символи, тому кирилиця — помилка
    test('Last name: Ukrainian letters', async ({ page }) => {
        await page.locator('#signupLastName').fill('Шевченко');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Last name is invalid');
        await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })

    // Валідне значення з пробілами навколо приймається (trim): помилки немає
    test('Last name: spaces around valid value are ignored', async ({ page }) => {
        await page.locator('#signupLastName').fill('  Taras  ');
        await page.locator('#signupLastName').blur();
        await expect(page.locator('.invalid-feedback')).toHaveCount(0);
    })
})

// ---------- Email ----------

test.describe('Registration: Email', () => {

    // Зайшли в поле і вийшли, нічого не ввівши
    test('Email: empty field', async ({ page }) => {
        await page.locator('#signupEmail').focus();
        await page.locator('#signupEmail').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Email required');
        await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Немає символу @
    test('Email: without @', async ({ page }) => {
        await page.locator('#signupEmail').fill('test+aqa.test.com');
        await page.locator('#signupEmail').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Email is incorrect');
        await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Немає домену після @
    test('Email: without domain', async ({ page }) => {
        await page.locator('#signupEmail').fill('test+aqa@');
        await page.locator('#signupEmail').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Email is incorrect');
        await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Немає частини перед @
    test('Email: without name before @', async ({ page }) => {
        await page.locator('#signupEmail').fill('@test.com');
        await page.locator('#signupEmail').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Email is incorrect');
        await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Домен без крапки (.com)
    test('Email: without top-level domain', async ({ page }) => {
        await page.locator('#signupEmail').fill('test+aqa@test');
        await page.locator('#signupEmail').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Email is incorrect');
        await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Пробіл усередині адреси
    test('Email: with space', async ({ page }) => {
        await page.locator('#signupEmail').fill('te st+aqa@test.com');
        await page.locator('#signupEmail').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Email is incorrect');
        await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Реєструємо користувача, очищаємо сесію і пробуємо зареєструвати такий самий email ще раз
    test('Email: already registered', async ({ page }) => {
        test.slow();
        const email = 'test+aqa' + Date.now() + '@test.com';
        await page.locator('#signupName').fill('Taras');
        await page.locator('#signupLastName').fill('Shevchenko');
        await page.locator('#signupEmail').fill(email);
        await page.locator('#signupPassword').fill('Qwerty123');
        await page.locator('#signupRepeatPassword').fill('Qwerty123');
        await page.locator('.modal-footer .btn-primary').click();
        await expect(page).toHaveURL(/panel\/garage/);

        await page.context().clearCookies();
        await page.goto('');
        await page.locator('.hero-descriptor_btn').click();
        await page.locator('#signupName').fill('Taras');
        await page.locator('#signupLastName').fill('Shevchenko');
        await page.locator('#signupEmail').fill(email);
        await page.locator('#signupPassword').fill('Qwerty123');
        await page.locator('#signupRepeatPassword').fill('Qwerty123');
        await page.locator('.modal-footer .btn-primary').click();
        await expect(page.locator('.alert-danger')).toContainText('User already exists');
    })
})

// ---------- Password ----------
// Усі помилки формату пароля мають один і той самий текст.

test.describe('Registration: Password', () => {

    // Зайшли в поле і вийшли, нічого не ввівши
    test('Password: empty field', async ({ page }) => {
        await page.locator('#signupPassword').focus();
        await page.locator('#signupPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Password required');
        await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // 7 символів, а мінімум 8
    test('Password: too short', async ({ page }) => {
        await page.locator('#signupPassword').fill('Qwert12');
        await page.locator('#signupPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // 16 символів, а максимум 15
    test('Password: too long', async ({ page }) => {
        await page.locator('#signupPassword').fill('Qwerty123456789a');
        await page.locator('#signupPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Немає цифри
    test('Password: without digit', async ({ page }) => {
        await page.locator('#signupPassword').fill('Qwertyuiop');
        await page.locator('#signupPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Немає великої літери
    test('Password: without capital letter', async ({ page }) => {
        await page.locator('#signupPassword').fill('qwerty123');
        await page.locator('#signupPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Немає малої літери
    test('Password: without small letter', async ({ page }) => {
        await page.locator('#signupPassword').fill('QWERTY123');
        await page.locator('#signupPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
        await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })
})

// ---------- Re-enter password ----------

test.describe('Registration: Re-enter password', () => {

    // Зайшли в поле і вийшли, нічого не ввівши
    test('Re-enter password: empty field', async ({ page }) => {
        await page.locator('#signupRepeatPassword').focus();
        await page.locator('#signupRepeatPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Re-enter password required');
        await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Обидва паролі валідні за форматом, але різні (остання цифра)
    test('Re-enter password: does not match', async ({ page }) => {
        await page.locator('#signupPassword').fill('Qwerty123');
        await page.locator('#signupRepeatPassword').fill('Qwerty124');
        await page.locator('#signupRepeatPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Passwords do not match');
        await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
        await expect(page.locator('.modal-footer .btn-primary')).toBeDisabled();
    })

    // Паролі чутливі до регістру
    test('Re-enter password: different letter case', async ({ page }) => {
        await page.locator('#signupPassword').fill('Qwerty123');
        await page.locator('#signupRepeatPassword').fill('QWerty123');
        await page.locator('#signupRepeatPassword').blur();
        await expect(page.locator('.invalid-feedback')).toHaveText('Passwords do not match');
        await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(220, 53, 69)');
    })
})
