const BasePage = require('./BasePage');

class PaymentPage extends BasePage {
    constructor(page) {
        super(page);
        this.heading = page.getByRole('heading', {level: 1})
    }

    async setPhoneNumber(text) {
        await this.type('input[data-testid="checkout-phone"]', text)
    }

    async setAddress(text) {
        await this.type('input[data-testid="checkout-address"]', text)
    }

    async setCity(text) {
        await this.type('input[data-testid="checkout-city"]', text)
    }

    async setCardNumber(text) {
        await this.type('input[data-testid="checkout-card-number"]', text)
    }

    async setExpiryDate(text) {
        await this.type('input[data-testid="checkout-expiry"]', text)
    }

    async setCvc(text) {
        await this.type('input[data-testid="checkout-cvc"]', text)
    }
    async cickPlaceOrder() {
        await this.click('button[data-testid="place-order"]')
    }

    async FillPaymentForm(phone, address, city, cardNumber, expiryDate, cvc) {
        await this.setPhoneNumber(phone)
        await this.setAddress(address)
        await this.setCity(city)
        await this.setCardNumber(cardNumber)
        await this.setExpiryDate(expiryDate)
        await this.setCvc(cvc)
        await this.cickPlaceOrder()
    }

    
}
module.exports = PaymentPage;