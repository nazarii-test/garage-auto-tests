import test, { expect } from "@playwright/test";

// Перевірки (assertions) з автоповтором: Playwright не падає одразу, а повторює перевірку
// кілька секунд (до тайм-ауту), чекаючи, поки умова стане правдою. Тому такі перевірки підходять
// для сторінок, де елементи з'являються не миттєво. Вони завжди пишуться з await.
test.describe('Auto-retrying Assertions', () => {

    // Перед кожним тестом групи відкриваємо головну сторінку (baseURL з playwright.config.ts).
    test.beforeEach(async ({ page }) => {
        await page.goto('');
    })

    // toBeVisible: перевіряє, що елемент є на сторінці й видимий. Відкриваємо вікно входу
    // і перевіряємо, що з'явився його заголовок. Потім закриваємо вікно і через not перевіряємо
    // протилежне: поле email більше не видно. not перед перевіркою інвертує її.
    test('toBeVisible', async ({ page }) => {
        await page.locator('.header_signin').click();
        await expect(page.locator('h4.modal-title')).toBeVisible();
        await page.locator('.close').click();
        await expect(page.locator('#signinEmail')).not.toBeVisible();
    })

    // toHaveText: текст елемента має збігатися з очікуваним ПОВНІСТЮ ("Log in").
    test('toHaveText', async ({ page }) => {
        await page.locator('.header_signin').click();
        await expect(page.locator('.modal-title')).toHaveText('Log in');
    })

    // toContainText: текст елемента має лише МІСТИТИ вказаний фрагмент ("Log").
    // Різниця з toHaveText: тут не потрібно писати текст повністю.
    test('toContainText', async ({ page }) => {
        await page.locator('.header_signin').click();
        await expect(page.locator('.modal-title')).toContainText('Log');
    })

    // toHaveValue: перевіряє значення поля вводу (те, що в ньому написано).
    // Вводимо email через fill() і перевіряємо, що в полі саме він. Для полів форм
    // використовують toHaveValue, а не toHaveText, бо текст поля зберігається в атрибуті value.
    test('toHaveValue', async ({ page }) => {
        await page.locator('.header_signin').click();
        await page.locator('#signinEmail').fill('testemail@gmail.com');
        await expect(page.locator('#signinEmail')).toHaveValue('testemail@gmail.com');
    })

    // toHaveCSS: перевіряє CSS-властивість елемента. Тут колір фону кнопки на головному екрані
    // має бути синім: rgb(2, 117, 216). Колір завжди пишеться у форматі rgb(...), навіть якщо в стилях hex.
    test('toHaveCSS', async ({ page }) => {
        await expect(page.locator('.hero-descriptor_btn')).toHaveCSS('background-color', 'rgb(2, 117, 216)')
    })

    // toBeChecked: перевіряє, що чекбокс відмічений. Переходимо на інший сайт (tutorialspoint),
    // ставимо галочку (check) і перевіряємо, що вона є. Потім знімаємо (uncheck) і через not
    // перевіряємо, що галочки вже немає.
    test('toBeChecked', async ({ page }) => {
        await page.goto('https://www.tutorialspoint.com/selenium/practice/check-box.php');
        await page.locator('#c_bs_1').check();
        await expect(page.locator('#c_bs_1')).toBeChecked();
        await page.locator('#c_bs_1').uncheck();
        await expect(page.locator('#c_bs_1')).not.toBeChecked();
    })

    // toHaveCount: перевіряє, що локатор знаходить рівно N елементів. Тут іконок соцмереж має бути 5.
    // На відміну від count(), цей метод чекає, поки кількість стане потрібною, тож він надійніший.
    test('toHaveCount', async ({ page }) => {
        await expect(page.locator('.socials_icon')).toHaveCount(5);
    })

    // toHaveURL: перевіряє адресу поточної сторінки. Тут її викликають на page, а не на локаторі,
    // бо перевіряється сама вкладка, а не елемент.
    test('toHaveURL', async ({ page }) => {
        await expect(page).toHaveURL('https://qauto.forstudy.space/');
    })

})


// Перевірки БЕЗ автоповтору: працюють зі звичайними значеннями JavaScript (числа, масиви, рядки),
// а не з елементами сторінки. Вони перевіряють значення миттєво, тому await не потрібен,
// і браузер (page) у цих тестах не використовується.
test.describe('Non-retrying Assertions', () => {

    // toBe: значення має точно дорівнювати очікуваному. Увага: 10 + 12 = 22, а очікується 20,
    // тому цей тест впаде. Це корисно для тренування: так видно, як виглядає помилка перевірки.
    test('toBe', () => {
        const result = 10 + 12;
        expect(result).toBe(20);
    })

    // toHaveLength: перевіряє довжину масиву (або рядка). У масиві 4 елементи, тест проходить.
    test('toHaveLength', () => {
        const array = [10, 20, 30, 40];
        expect(array).toHaveLength(4);
    })

    // toContain: перевіряє, що рядок (або масив) містить значення. Тут not інвертує перевірку:
    // очікується, що 'Test string' НЕ містить 'Test'. Але містить, тому тест впаде.
    test('toContain', () => {
        const string = 'Test string';
        expect(string).not.toContain('Test')
    })
})
