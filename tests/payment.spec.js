const {test, expect} = require ('@playwright/test');

const HomePage = require('../pages-objects/HomePage');
const RegisterPage = require('../pages-objects/RegisterPage');
const LoginPage = require('../pages-objects/LoginPage');
const Productpage = require('../pages-objects/ProductsPage');
const ProductDetailsPage = require('../pages-objects/ProductDetailsPage');
const CartPage = require('../pages-objects/CartPage');

test.describe('Testing Payment Page', () => {
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

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        registerPage= new RegisterPage(page);
        loginPage = new LoginPage(page);
        productpage = new Productpage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);

        await homePage.openHomePage();
        await homePage.clickRegisterLink();
        await registerPage.fillAndSubmit('jon doe', 'jondoe@email.com', 'jon12345');
    })

    test('Payment Page Loads when a shopper is logged in', async({page}) => {

        await homePage.clickProductsLink();
        await productpage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickAddToCartButton();
        await homePage.clickCartLink();
        await cartPage.clickCheckoutButton();

        await expect(registerPage.heading).toHaveText('Payment page coming soon');
    })

    test('A logged in user with empty cart redirected to cart page instead of the payment page', async ({page}) => {

        await homePage.openPaymenPage();
        const emptyCartHeading = cartPage.getEmptyCartHeading();
        await expect(emptyCartHeading).toHaveText('Your cart is empty'); 
    })

    test('A non logged in user cannot redirects to login page instead of payement page', async({page}) => {
        
        await homePage.clickLogoutLink();
        await homePage.clickProductsLink();
        await productpage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickAddToCartButton();
        await homePage.clickCartLink();
        await cartPage.clickCheckoutButton();

        await expect(loginPage.heading).toHaveText('Log in');
        await expect(page.getByTestId('login-required-message')).toHaveText('Please log in to continue to payment');
    })
})

test.describe('Session expiry after 24 hours', () => {
    const HOUR = 60 * 60 * 1000;
    /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;
    /**@type {LoginPage} */
    let loginPage;
    /** @type {Productpage} */
    let productpage;
    /** @type {ProductDetailsPage} */
    let productDetailsPage;
    /** @type {CartPage} */
    let cartPage;

    test.beforeEach(async ({page}) => {
        await page.clock.install({ time: new Date('2026-11-16T10:00:00')});

        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        productpage = new Productpage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);

        await homePage.openHomePage();
        await homePage.clickRegisterLink();

        await registerPage.fillAndSubmit('jon doe', 'jondoe@email.com', 'jondoe123');
        await expect(page.getByTestId('nav-user-name')).toBeVisible();
    })

    test('Session is KEPT while user in the payment BEFORE 24 hours', async ({page}) => {

        await homePage.clickProductsLink();
        await productpage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickAddToCartButton();
        await homePage.clickCartLink();
        await cartPage.clickCheckoutButton();

         await page.clock.fastForward(23 * HOUR + 59 * 60 * 1000);
         await page.reload();

         await expect(registerPage.heading).toBeVisible()
    })

    test('Session is EXPIRED while user in the payment page AFTER 24 hours', async ({page}) => {

        await homePage.clickProductsLink();
        await productpage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickAddToCartButton();
        await homePage.clickCartLink();
        await cartPage.clickCheckoutButton();

         await page.clock.fastForward(24 * HOUR + 60 * 1000);
         await page.reload();

         await expect(loginPage.heading).toBeVisible()
        //  await expect(page.getByTestId('session-expired-message')).toBeVisible()
        await expect(page.getByTestId('nav-login')).toBeVisible();
    })
})