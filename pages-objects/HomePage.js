const BasePage = require('./BasePage');

class HomePage extends BasePage{
    constructor(page) {
        super(page);
    }

    async openHomePage() {
        await this.navigate('/');
    }

    async openPaymenPage() {
        await this.navigate('/payment')
    }

    async getTitleText() {
        return await this.getText('h1')
    }

    async clickCartLink() {
        await this.click('li a[href="/cart"]');
    }

    async clickProductsLink() {
        await this.click('a[data-testid="nav-products"]');
    }

    async clickRegisterLink() {
        await this.click('a[data-testid="nav-register"]');
    }

    async clickLoginLink(){
        await this.click('a[data-testid="nav-login"]')
    }

    async clickLogoutLink() {
        await this.click('button[data-testid="nav-logout"]');
    }




}

module.exports = HomePage;