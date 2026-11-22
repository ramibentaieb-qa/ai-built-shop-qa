const {test, expect} = require ('@playwright/test');

const HomePage = require('../pages-objects/HomePage');
const RegisterPage = require('../pages-objects/RegisterPage');
const LoginPage = require('../pages-objects/LoginPage');
const ProductsPage = require('../pages-objects/ProductsPage');
const ProductDetailsPage = require('../pages-objects/ProductDetailsPage');
const CartPage = require('../pages-objects/CartPage');
const PaymentPage = require('../pages-objects/PaymentPage')
const ConfirmationPage =  require('../pages-objects/ConfirmationPage')

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

test.describe('Testing Order Confirmation Page', () => {

    /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;
    /** @type {LoginPage} */
    let loginPage;
    /** @type {ProductsPage} */
    let productsPage;
    /** @type {ProductDetailsPage} */
    let productDetailsPage;
    /** @type {CartPage} */
    let cartPage;
    /** @type {PaymentPage} */
    let paymentPage;
    /** @type {ConfirmationPage} */
    let confirmationPage

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        registerPage= new RegisterPage(page);
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);
        paymentPage = new PaymentPage(page)
        confirmationPage = new ConfirmationPage(page)

        await homePage.openHomePage();
        await homePage.clickRegisterLink();
        await registerPage.fillAndSubmit(user.name, user.email, user.password);
        await homePage.clickProductsLink();
        await productsPage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickAddToCartButton();
        await homePage.clickCartLink();
        await cartPage.clickCheckoutButton();
    })

    test('Order Confirmation Page Loads and the cart is empty', async({page}) => {
        await paymentPage.FillPaymentForm(card.phoneNumber, card.address, card.city, card.cardNumber, card.expiryDate, card.cvc)

        await expect(confirmationPage.heading).toHaveText('Order placed')
        await expect(page.getByTestId('cart-badge')).toBeHidden()

        await homePage.clickCartLink()

        await expect(page.getByTestId('cart-empty')).toHaveText('Your cart is empty');
    })

})



test.describe('Testing Order Confirmation passing details', () => {

    /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;
    /** @type {LoginPage} */
    let loginPage;
    /** @type {ProductsPage} */
    let productsPage;
    /** @type {ProductDetailsPage} */
    let productDetailsPage;
    /** @type {CartPage} */
    let cartPage;
    /** @type {PaymentPage} */
    let paymentPage;
    /** @type {ConfirmationPage} */
    let confirmationPage

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        registerPage= new RegisterPage(page);
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);
        paymentPage = new PaymentPage(page)
        confirmationPage = new ConfirmationPage(page)

        await homePage.openHomePage();
        await homePage.clickRegisterLink();
        await registerPage.fillAndSubmit(user.name, user.email, user.password);
        
        await homePage.clickProductsLink();
        await productsPage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickIncreaseButton()
        await productDetailsPage.clickAddToCartButton()
        await productDetailsPage.clickReturnButton()
        await productsPage.clickAProduct(2)
        await productDetailsPage.selectSize('M')
        await productDetailsPage.addToCartTimes(2)
        await productDetailsPage.clickAddToCartButton()
        await homePage.clickCartLink()
        await cartPage.clickCheckoutButton()

        await paymentPage.FillPaymentForm(card.phoneNumber, card.address, card.city, card.cardNumber, card.expiryDate, card.cvc)
    })
        
        test('Order Confirmation page desplays USER information', async({page}) => {

            await expect(page.getByTestId('order-name')).toHaveText(user.name)
            await expect(page.getByTestId('order-email')).toHaveText(user.email)
            await expect(page.getByTestId('order-address')).toHaveText(card.address)
            await expect(page.getByTestId('order-city')).toHaveText(card.city)            
        })

        test('Order Confirmation page desplays PRODUCT information', async ({page}) => {

            await expect(page.getByTestId('order-item')).toContainText(['Midnight Grid Tee', 'Concrete Stripe Tee'])
            await expect(page.getByTestId('order-item')).toContainText(['Size S', 'Size M'])
            await expect(page.getByTestId('order-item')).toContainText(['Quantity 2', 'Quantity 3'])

            await expect(page.getByTestId('order-item')).toContainText(['$59.98', '$97.50'])  
        })

        test('Order Confirmation page desplays a unique order number', async ({page}) => {

             const firstOrderNumber = await confirmationPage.orderNumber.textContent()

             await confirmationPage.clickContinueShoppingButton()
             await productsPage.clickAProduct(3)
             await productDetailsPage.selectSize('XL')
             await productDetailsPage.clickAddToCartButton()
             await homePage.clickCartLink()
             await cartPage.clickCheckoutButton()
             await paymentPage.FillPaymentForm(card.phoneNumber, card.address, card.city, card.cardNumber, card.expiryDate, card.cvc)

             const secondOrderNumber = await confirmationPage.orderNumber.textContent();

             expect(firstOrderNumber).not.toBe(secondOrderNumber)
        })
        
})

test.describe('Order Confirmation navigation logic', () => {
     /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;
    /** @type {LoginPage} */
    let loginPage;
    /** @type {ProductsPage} */
    let productsPage;
    /** @type {ProductDetailsPage} */
    let productDetailsPage;
    /** @type {CartPage} */
    let cartPage;
    /** @type {PaymentPage} */
    let paymentPage;
    /** @type {ConfirmationPage} */
    let confirmationPage

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        registerPage= new RegisterPage(page);
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);
        paymentPage = new PaymentPage(page)
        confirmationPage = new ConfirmationPage(page)

        await homePage.openHomePage();
    })

    test('A non logged in shopper cannot navigate to order-confirmation page', async({page}) => {

        await page.goto('/order-confirmation');
        await expect(page).toHaveURL('/login')
        await expect(loginPage.heading).toHaveText('Log in')
    })

    test('A shopper with zero added products to cart cannot navigate to order-confirmation', async({page}) => {

        await homePage.clickRegisterLink();
        await registerPage.fillAndSubmit(user.name, user.email, user.password);

        await page.goto('/order-confirmation');
        await expect(page).toHaveURL('/cart')
        await expect(cartPage.cartHeading).toHaveText('Your cart')  
    })


    test('From the order confirmation page, the back button does not allow a second payment', async({page}) => {

        await homePage.clickRegisterLink();
        await registerPage.fillAndSubmit(user.name, user.email, user.password);
        await homePage.clickProductsLink();
        await productsPage.clickAProduct(1)
        await productDetailsPage.selectSize('S')
        await productDetailsPage.clickAddToCartButton()
        await homePage.clickCartLink()
        await cartPage.clickCheckoutButton()
        await paymentPage.FillPaymentForm(card.phoneNumber, card.address, card.city, card.cardNumber, card.expiryDate, card.cvc)
        await expect(confirmationPage.heading).toHaveText('Order placed')
        
        await page.goBack()

        await expect(page).toHaveURL('/cart')
        await expect(cartPage.cartHeading).toHaveText('Your cart')
    })
})


