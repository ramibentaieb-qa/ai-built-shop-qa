const BasePage = require('./BasePage');

class ConfirmationPage extends BasePage {
    constructor(page) {
        super(page);
        this.heading = page.getByRole('heading', {level: 1})
        this.orderNumber = page.getByTestId('order-number')
    }

    async clickContinueShoppingButton() {
        await this.click('a[data-testid="continue-shopping"]');
    }

}

module.exports = ConfirmationPage;