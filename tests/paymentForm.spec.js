const {test, expect} = require ('@playwright/test');

const HomePage = require('../pages-objects/HomePage');
const RegisterPage = require('../pages-objects/RegisterPage');
const LoginPage = require('../pages-objects/LoginPage');
const Productpage = require('../pages-objects/ProductsPage');
const ProductDetailsPage = require('../pages-objects/ProductDetailsPage');
const CartPage = require('../pages-objects/CartPage');
const PaymentPage = require('../pages-objects/PaymentPage')
const ConfirmationPage =  require('../pages-objects/ConfirmationPage')

test.describe('Testing Payment Form', () => {
    /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;
    /** @type {LoginPage} */
    let loginPage;
    /** @type {Productpage} */
    let productpage;
    /** @type {ProductDetailsPage} */
    let productDetailsPage;
    /** @type {CartPage} */
    let cartPage;
    /** @type {PaymentPage} */
    let paymentPage;
    /** @type {ConfirmationPage} */
    let confirmationPage

    const user = {
        name: 'jon doe',
        email: 'jondoe@email.com',
        password: 'jon12345'
    }

    const card = {
        phoneNumber: "25252525",
        address: 'Testing Str',
        city: 'Test City',
        cardNumber: '4242424242424242',
        expiryDate: '09/27',
        cvc: "123"
    }

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        registerPage= new RegisterPage(page);
        loginPage = new LoginPage(page);
        productpage = new Productpage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);
        paymentPage = new PaymentPage(page)
        confirmationPage = new ConfirmationPage(page)

        await homePage.openHomePage();
        await homePage.clickRegisterLink();
        await registerPage.fillAndSubmit(user.name, user.email, user.password);
        await homePage.clickProductsLink();
        await productpage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickAddToCartButton();
        await homePage.clickCartLink();
    })


    test('Payment page shows order total from cart', async({page}) => {

        await expect(page.getByTestId('cart-total')).toHaveText('$34.99');
        await cartPage.clickCheckoutButton();
        await expect(page.getByTestId('checkout-total')).toHaveText('$34.99')
        await expect(page.getByTestId('checkout-name')).toHaveValue(user.name)
        await expect(page.getByTestId('checkout-email')).toHaveValue(user.email);
    })


    test('Successfull payment testing with vaid card credentials', { tag: '@smoke'}, async({page}) => {
        await cartPage.clickCheckoutButton();
         
        await paymentPage.FillPaymentForm(card.phoneNumber, card.address, card.city, card.cardNumber, card.expiryDate, card.cvc);
        await expect(confirmationPage.heading).toHaveText('Order placed')

    })

    test('All Fields are mandatory', async({page}) => {
        await cartPage.clickCheckoutButton();
        await paymentPage.FillPaymentForm('', '', '', '', '', '');

        await expect(page.locator('#checkout-phone-error, #checkout-address-error, #checkout-city-error, #checkout-card-number-error, #checkout-expiry-error, #checkout-cvc-error')).toHaveText([
            'Phone number is required',
            'Address is required',
            'City is required',
            'Card number is required',
            'Expiry date is required',
            'CVC is required'
        ])
    })


    test('Failed payment with invalid card credentials', async ({page}) => {
        await cartPage.clickCheckoutButton();

        await paymentPage.FillPaymentForm(card.phoneNumber, card.address, card.city, "42422424242424", '10/26', '12');

        await expect(page.locator('#checkout-card-number-error, #checkout-expiry-error, #checkout-cvc-error')).toHaveText([
            'Card number must have 16 digits',
            'Expiry date must not be in the past',
            'CVC must have 3 digits'
        ])
    })


    test('Error message disappears when its fild is corrected', async({page}) => {
        await cartPage.clickCheckoutButton();
        await paymentPage.FillPaymentForm('', '', '', '', '', '');

        await expect(page.locator('#checkout-phone-error, #checkout-address-error, #checkout-city-error, #checkout-card-number-error, #checkout-expiry-error, #checkout-cvc-error')).toHaveText([
            'Phone number is required',
            'Address is required',
            'City is required',
            'Card number is required',
            'Expiry date is required',
            'CVC is required'
        ])

        await paymentPage.FillPaymentForm(card.phoneNumber, card.address, card.city, card.cardNumber, card.expiryDate, card.cvc);

        await expect(page.locator('#checkout-phone-error, #checkout-address-error, #checkout-city-error, #checkout-card-number-error, #checkout-expiry-error, #checkout-cvc-error'))
        .toBeHidden()
    })
})