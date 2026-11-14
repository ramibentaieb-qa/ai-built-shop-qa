const BasePage = require('./BasePage');

class CartPage extends BasePage{
    constructor(page) {
        super(page);
        this.cartHeading = page.getByRole('heading', { name: 'Your cart' });
    }

    getEmptyCartHeading() {
        return  this.page.locator('p[data-testId="cart-empty"]');
    }

    async clickCartDecreaseButtton() {
        await this.click('button[data-testId="cart-item-decrease"]');
    }

    async clickCartIncreaseButton() {
        await this.click('button[data-testId="cart-item-increase"]');
    }

    async increaseQuantityCart(times) {
        for (let i = 0; i < times; i++) {
            await this.clickCartIncreaseButton();
        }
    }

    async clickReturnToProducts() {
        await this.click('a[data-testid="continue-shopping"]')
    }

    async clickRemoveButton() {
        await this.click('button[data-testid="cart-item-remove"]');
    }

}

module.exports = CartPage;