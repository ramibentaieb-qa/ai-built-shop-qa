const {test, expect} = require('@playwright/test');
const HomePage = require('../pages-objects/HomePage');
const ProductPage = require('../pages-objects/ProductsPage');
const ProductDetailsPage = require('../pages-objects/ProductDetailsPage');
const CartPage = require('../pages-objects/CartPage');

test.describe('Testing Cart Page', () => {
    
    let homePage;
    let productsPage;
    let productDetailsPage;
    let cartPage;

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        productsPage = new ProductPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);

        await homePage.openHomePage();
        await homePage.clickProductsLink();
    })

    test('Empty Cart when no product been added', async({page}) => {

        await productsPage.clickAProduct(10);
        await homePage.clickCartLink();

        const emptyCartHeading = cartPage.getEmptyCartHeading();
        await expect(emptyCartHeading).toHaveText('Your cart is empty')

        await cartPage.clickReturnToProducts();

        const productsHeading = await productsPage.getProductsHeading();
        expect(productsHeading).toContain("Men's urban t-shirts");
    })

    test('Cart page should display all aded products cards with their details', async({page}) => {

        await productsPage.clickAProduct(1);
        await productDetailsPage.selectSize('S');
        await productDetailsPage.clickAddToCartButton();
        await productDetailsPage.clickReturnButton();
        await productsPage.clickAProduct(2);
        await productDetailsPage.selectSize('M');
        await productDetailsPage.clickIncreaseButton();
        await productDetailsPage.clickAddToCartButton();

        await homePage.clickCartLink();

        const card = page.getByTestId('cart-item');
        await expect(card).toHaveCount(2)

        const images = page.getByTestId('cart-item-image');
        await expect(images).toHaveCount(2);

        const names = await page.getByTestId('cart-item-name').allTextContents();
        expect(new Set(names).size).toBe(2);

        const sizes = await page.getByTestId('cart-item-size').allTextContents();
        expect(new Set(sizes).size).toBe(2);

        const prices = await page.getByTestId('cart-item-price').allTextContents();
        expect(new Set(prices).size).toBe(2);

        const quantities = await page.getByTestId('cart-item-quantity').allTextContents();
        expect(new Set(quantities).size).toBe(2)
    })


    test('Changing quantity iupdates the line total and cart badge', async({page}) => {

        await productsPage.clickAProduct(3);
        await productDetailsPage.selectSize('XL');
        await productDetailsPage.clickAddToCartButton();

        await homePage.clickCartLink();

        await expect(page.getByTestId('cart-item-total')).toContainText('$27.00');

        await cartPage.increaseQuantityCart(9);

        await expect(page.getByTestId('cart-item-total')).toContainText('$270.00');

        await expect(page.getByTestId('cart-badge')).toHaveText('10');

        await cartPage.clickCartDecreaseButtton();

        await expect(page.getByTestId('cart-item-total')).toContainText('$243.00');

        await expect(page.getByTestId('cart-badge')).toHaveText('9');
    })


    test('Remove button should removes product card from cart page', async({page}) => {

        await productsPage.clickAProduct(1);
        await productDetailsPage.selectSize('XL');
        await productDetailsPage.clickAddToCartButton();

        await homePage.clickCartLink();

        const card = page.getByTestId('cart-item');
        await expect(card).toHaveCount(1)

        await cartPage.clickRemoveButton();

        await expect(card).toHaveCount(0)
    })
})