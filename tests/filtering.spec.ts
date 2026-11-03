import test from '@playwright/test';

// Перед кожним тестом відкриваємо головну сторінку (baseURL береться з playwright.config.ts)
test.beforeEach(async ({ page }) => {
    await page.goto('');
})

// hasText: фільтр залишає тільки ті елементи, у яких є вказаний текст.
// Тут беремо всі кнопки й лишаємо ті, де є "Sign up"; у другому рядку — те саме через getByRole
// (кнопки, у тексті яких є "Sign"). Дій і перевірок немає, тому тест лише показує синтаксис.
test('.filter hasText', async ({ page }) => {
    page.locator('//button').filter({ hasText: 'Sign up' });
    page.getByRole('button').filter({ hasText: 'Sign' });
})

// hasNotText: протилежність hasText — залишає кнопки, у яких НЕМАЄ тексту "Sign".
test('.filter hasNotText', async ({ page }) => {
    page.locator('button').filter({ hasNotText: 'Sign' });
})

// has: залишає лише ті елементи, ВСЕРЕДИНІ яких є вкладений елемент за іншим локатором.
// Тут шукаємо посилання <a>, що містить іконку Telegram (.icon-telegram), підсвічуємо його і клікаємо.
// highlight() і click() викликаємо окремо від створення локатора, бо highlight() повертає не локатор.
test('.filter has', async ({ page }) => {
    const buttonche = page.locator('//a').filter({ has: page.locator('.icon-telegram') });
    await buttonche.highlight();
    await buttonche.click();
})

// hasNot: протилежність has — залишає посилання <a>, всередині яких НЕМАЄ іконки Telegram.
// Помилка: highlight() у кінці рядка робить із змінної buttonche проміс, а не локатор,
// і без await. Правильно — створити локатор окремо, а потім викликати await buttonche.highlight().
test('.filter hasNot', async ({ page }) => {
    const buttonche = page.locator('//a').filter({ hasNot: page.locator('.icon-telegram') }).highlight();
})

// Ланцюжок локаторів: спочатку шукаємо <nav> (меню), а потім усередині нього — посилання <a>.
// Так пошук звужується до потрібної частини сторінки. Далі посилання підсвічуються.
test('.locator.locator', async ({ page }) => {
    page.locator('//nav').locator('//a').highlight();
})
