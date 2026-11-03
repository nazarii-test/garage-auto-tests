import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage {

    private readonly editProfileButton = this.page.getByRole('button', { name: 'Edit profile' });
    public readonly profileName = this.page.locator('.profile_name');
    public readonly profilePhoto = this.page.locator('.profile_photo');
    public readonly profileBirthday = this.page.locator('.icon-birthday + .profile-info_text')
    public readonly profileCountry = this.page.locator('.icon-country + .profile-info_text')

    async navigate() {
        await super.navigate('/panel/profile');
    }

    async openEditProfileForm() {
        await this.editProfileButton.click();
    }

}