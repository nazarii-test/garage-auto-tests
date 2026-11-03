import { Locator } from '@playwright/test'
import { BaseForm } from './BaseForm';

export class SignInForm extends BaseForm {
    private readonly emailField: Locator = this.page.getByRole('textbox', { name: 'Email' });
    private readonly passwordField: Locator = this.page.getByRole('textbox', { name: 'Password' });
    private readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
    public readonly emptyEmailMessage: Locator = this.page.getByText('Email required');
    public readonly emptyPasswordMessage: Locator = this.page.getByText('Password required');
    public readonly wrongEmailMessage: Locator = this.page.getByText('Email is incorrect');
    public readonly wrongCredentialsMessage: Locator = this.page.getByText('Wrong email or password');

    async signInWithCredentials(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    async enterEmail(email: string) {
        await this.emailField.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async triggerErrorOnField(fieldName: string) {
        let field: Locator;

        if (fieldName === 'email') {
            field = this.emailField;
        } else if (fieldName === 'password') {
            field = this.passwordField;
        } else {
            throw new Error('Wrong field name');
        }

        await field.focus();
        await field.blur();
    }
}