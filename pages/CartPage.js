const BasePage = require('./BasePage');

class CartPage extends BasePage{
    constructor(page) {
        super(page);
        this.cartHeading = page.getByRole('heading', { name: 'Your cart' });
    }

    async getCartTitle() {
        return await this.getText('h1');
    }



}

module.exports = CartPage;