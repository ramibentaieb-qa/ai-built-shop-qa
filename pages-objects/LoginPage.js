const BasePage = require('../pages-objects/BasePage')

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.heading = page.getByRole('heading', {level: 1});
    }

    async setEmail(text) {
        await this.type('input[data-testid="login-email"]', text);
    }

    async setPassword(text) {
        await this.type('input[data-testid="login-password"]', text)
    }

    async clickLoginButton() {
        await this.click('button[data-testid="login-submit"]');
    }

    async loginFillAndSubmit(email, password) {
        await this.setEmail(email);
        await this.setPassword(password);
        await this.clickLoginButton();
    }

}
module.exports = LoginPage;