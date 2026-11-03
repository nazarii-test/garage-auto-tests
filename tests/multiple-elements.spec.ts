import test from '@playwright/test';

// Перед кожним тестом відкриваємо головну сторінку (baseURL береться з playwright.config.ts)
test.beforeEach(async ({ page }) => {
    await page.goto('');
})

// count: рахуємо, скільки на сторінці елементів з класом "socials_icon" (іконки соцмереж).
// Локатор .socials_icon збігається одразу з кількома елементами, а count() повертає їх кількість.
// Результат виводиться в консоль.
test('count', async ({ page }) => {
    const elements = page.locator('.socials_icon');
    console.log(await elements.count());
})

// first: з усіх знайдених іконок беремо ПЕРШУ (за порядком у DOM) і підсвічуємо її рамкою.
// first() перетворює "багато елементів" на один конкретний.
// Увага: перед highlight() немає await, тому тест може завершитись раніше, ніж рамка з'явиться.
test('first', async ({ page }) => {
    const elements = page.locator('.socials_icon');
    elements.first().highlight();
})

// last: те саме, але беремо ОСТАННЮ іконку зі списку.
test('last', async ({ page }) => {
    const elements = page.locator('.socials_icon');
    elements.last().highlight();
})

// nth: беремо іконку за порядковим номером. Нумерація починається з 0,
// тому nth(3) — це четверта іконка (instagram).
test('nth', async ({ page }) => {
    const elements = page.locator('.socials_icon');
    elements.nth(3).highlight();
})

// all: знаходимо ВСІ посилання <a> на сторінці й по черзі виводимо текст кожного.
// all() перетворює локатор на масив окремих локаторів, який можна обійти циклом for...of.
// textContent() повертає текст усередині елемента; у посилань-іконок він буде порожнім.
test('all', async ({ page }) => {
    const elements = page.locator('a');
    for(const item of await elements.all()) {
        const text = await item.textContent();
        console.log(text)
    }
})