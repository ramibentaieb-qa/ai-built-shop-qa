const BasePage = require('./BasePage');

class PaymentPage extends BasePage {
    constructor(page) {
        super(page);
        this.heading = page.getByRole('heading', {level: 1})
    }











}
module.exports = PaymentPage;