const CartPage = require('../pages-objects/CartPage');
const HomePage = require('../pages-objects/HomePage');
const NotFoundPage = require('../pages-objects/NotFoundPage');
const {test, expect} = require('@playwright/test');


test.describe('Testing First Setup', () => {

    test('Home Page Loads', async ({page}) => {

        const homePage = new HomePage(page);
        await homePage.openHomePage();

        const title = await homePage.getTitleText();
        expect(title).toContain('MiniMart');
    })

    test('Cart Link opens the cart page', async({page}) => {
        const homePage = new HomePage(page);
        await homePage.openHomePage();
        await homePage.clickCartLink();

        await expect(page).toHaveURL(/\/cart/);

        const cartPage = new CartPage(page);
        // const heading = await cartPage.getCartTitle();
        // expect(heading).toContain('Your cart');
        await expect(cartPage.cartHeading).toHaveText('Your cart')

    })


    test('Unknown URL shows Page Not Found', async ({page}) => {
        const notFoundPage = new NotFoundPage(page);
        const response = await notFoundPage.openUnknownPage();

        expect(response.status()).toBe(404);

        const heading = await notFoundPage.getHeadingText();
        expect(heading).toContain('Page not found')
    })
    
})