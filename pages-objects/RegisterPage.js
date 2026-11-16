const BasePage = require('./BasePage');

class RegisterPage extends BasePage {
    constructor(page) {
        super(page);
        this.heading = page.getByRole('heading', {level: 1});
    }

    // async getRegisterHeading() {
    //     return await this.getText('div h1');
    // }

    async clickCreateAccountButton() {
        await this.click('button[data-testid="register-submit"]');
    }

    async setFullName(text) {
        await this.type('input[data-testid="register-name"]', text);
    }

    async setEmail(text) {
        await this.type('input[data-testid="register-email"]', text);
    }

    async setPassword(text) {
        await this.type('input[data-testid="register-password"]', text);
    }

    async setConfirmPassword(text) {
        await this.type('input[data-testid="register-confirm-password"]', text);
    }

    async fillAndSubmit(name,email,password, confirm = password) {
        await this.setFullName(name);
        await this.setEmail(email);
        await this.setPassword(password);
        await this.setConfirmPassword(confirm);
        await this.clickCreateAccountButton();
    }
}

module.exports = RegisterPage;