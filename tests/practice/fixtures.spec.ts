import { chromium } from '@playwright/test';
import { test, expect } from '../../utils/fixtures/screenSizesFixtures';

test.describe('Fixtures', () => {

    test.skip('open wikipedia without fixtures', async () => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://wikipedia.org')
    })

    test('open wikipedia with small screen', async ({ mediumScreen, smallScreen, bigScreen }) => {
        await smallScreen.goto('https://wikipedia.org');
        await smallScreen.waitForTimeout(1000);
    })

    test('open wikipedia with medium screen', async ({ mediumScreen }) => {
        await mediumScreen.goto('https://wikipedia.org');
        await mediumScreen.waitForTimeout(1000);
    })

    test('open wikipedia with big screen', async ({ bigScreen }) => {
        await bigScreen.goto('https://wikipedia.org');
        await bigScreen.waitForTimeout(1000);
    })
})