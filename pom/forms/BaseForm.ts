import { Page } from "@playwright/test";

export class BaseForm {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}