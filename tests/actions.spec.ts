import test from "@playwright/test";

// Група тестів про ДІЇ З ЕЛЕМЕНТАМИ: клік, введення тексту, чекбокси, фокус, скрол, випадаючі списки.
// test.describe об'єднує тести в одну групу, щоб звіт був охайніший, а beforeEach діяв лише на неї.
test.describe("Actions with elements", () => {
  // Перед кожним тестом цієї групи відкриваємо головну сторінку (baseURL з playwright.config.ts).
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  // click і dblclick: два види кліку по кнопці Sign In.
  // Перший клік — правою кнопкою миші (button: 'right'), а force: true змушує клікнути
  // навіть якщо Playwright вважає елемент недоступним (перекритий чи неактивний).
  // Другий — подвійний клік.
  test("click", async ({ page }) => {
    await page.getByText("Sign In").click({
      force: true,
      button: "right",
    });
    await page.getByText("Sign In").dblclick();
  });

  // fill і pressSequentially: два способи ввести текст.
  // fill() вставляє весь текст одразу (як вставка), pressSequentially() друкує символ за символом
  // із затримкою delay (500 мс між літерами), як справжній користувач на клавіатурі.
  test("click, fill and pressSequentially", async ({ page }) => {
    await page.getByText("Sign In").click();
    await page.locator("#signinEmail").fill("test@test.com");
    await page
      .locator("#signinPassword")
      .pressSequentially("testtest", { delay: 500 });
  });

  // press: натискання окремої клавіші. Після введення email натискаємо Tab,
  // щоб фокус перейшов на наступне поле форми.
  test("press", async ({ page }) => {
    await page.getByText("Sign In").click();
    await page.locator("#signinEmail").fill("test@test.com");
    await page.locator("#signinEmail").press("Tab");
  });

  // check, uncheck, isChecked: робота з чекбоксами на ІНШОМУ сайті (goto всередині тесту
  // переходить на tutorialspoint). Спочатку розкриваємо дерево кліками по "+" (Main Level, потім Sub Level),
  // далі check() ставить галочку, uncheck() знімає, а isChecked() повертає true/false.
  // Результат isChecked виводимо в консоль: перший раз має бути true, другий false.
  test("check, uncheck, isChecked", async ({ page }) => {
    await page.goto(
      "https://tutorialspoint.com/selenium/practice/check-box.php",
    );
    await page.locator("#bs_main > span.plus").click();
    await page.locator("#bf_1 > span.plus").click();
    await page.locator("#c_io_4").check();
    console.log(await page.locator("#c_io_4").isChecked());
    await page.locator("#c_io_4").uncheck();
    console.log(await page.locator("#c_io_4").isChecked());
  });

  // focus і blur: фокус на полі та зняття фокуса. Відкриваємо форму реєстрації (Sign up),
  // ставимо курсор у поле Last name (focus), а потім прибираємо його (blur).
  // Це спрацьовує, наприклад, щоб викликати перевірку поля, яка запускається при виході з нього.
  test("blur, focus", async ({ page }) => {
    await page.getByText("Sign up").click();
    await page.locator("#signupLastName").focus();
    await page.locator("#signupLastName").blur();
  });

  // scrollIntoViewIfNeeded: прокручує сторінку до елемента, якщо його не видно на екрані.
  // Тут скролимо до блоку з іконками соцмереж у футері.
  test("scrollInto", async ({ page }) => {
    await page.locator(".contacts_socials").scrollIntoViewIfNeeded();
  });

  // selectOption: вибір значення у випадаючому списку (<select>).
  // Логінимось, відкриваємо форму додавання авто, вибираємо марку за видимим текстом (label: 'Fiat'),
  // модель за значенням ('Panda'), вводимо пробіг і натискаємо кнопку підтвердження у модальному вікні.
  test("Dropdowns", async ({ page }) => {
    await page.getByText("Sign In").click();
    await page
      .locator("#signinEmail")
      .fill("michael.krasnovskyi+testUser1@gmail.com");
    await page.locator("#signinPassword").fill("ZSgeVQhuU3qkvlG");
    await page.getByText("Login").click();
    await page.locator(".panel-page_heading > .btn-primary").click();
    await page.locator("#addCarBrand").selectOption({ label: "Fiat" });
    await page.locator("#addCarModel").selectOption("Panda");
    await page.locator("#addCarMileage").fill("1000");
    await page.locator(".modal-footer .btn-primary").click();
  });
});

// Група тестів про ДІЇ ЗІ СТОРІНКОЮ (навігація, перезавантаження тощо), на відміну від дій з елементами.
test.describe("Actions with page", () => {
  // page goto: мав би відкривати сторінку за адресою. Але в коді помилка:
  // page — це об'єкт, його не можна викликати як функцію. Правильно: await page.goto('/new-page').
  test("page goto", async ({ page }) => {
    await page("//new-page");
  });
});
