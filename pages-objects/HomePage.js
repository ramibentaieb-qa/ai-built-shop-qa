const BasePage = require('./BasePage');

class HomePage extends BasePage{
    constructor(page) {
        super(page);
    }

    async openHomePage() {
        await this.navigate('http://localhost:3000');
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




}

module.exports = HomePage;