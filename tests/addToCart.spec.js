const {test, expect} = require('@playwright/test');
const ProductPage = require('../pages-objects/ProductsPage');
const ProductDetailsPage = require('../pages-objects/ProductDetailsPage');
const HomePage = require ('../pages-objects/HomePage')



test.describe('Testing Add To Cart Functionalities', () => {
    let homePage;
    let productPage;
    let productDetailsPage;

    test.beforeEach(async({page}) =>{
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        productDetailsPage = new ProductDetailsPage(page);

        await homePage.openHomePage();
        await homePage.clickProductsLink();
    })


    test('Error message appears when adding empty item', async({page}) => {

        await productPage.clickAProduct(8);
        
        await productDetailsPage.clickAddToCartButton();
        const errorSizeMessage = await productDetailsPage.getErrorMessage();
        await expect(errorSizeMessage).toContain('Please select a size'); 
    })


    test('Visibility of Cart Badge when an Item is Added', async({page}) => {
        
        const cartBadge = productDetailsPage.getCartBadge();
        await expect(cartBadge).toBeHidden();

        await productPage.clickAProduct(10);
        await productDetailsPage.selectSize('XL')
        await productDetailsPage.clickAddToCartButton();
        await expect(cartBadge).toBeVisible();
    })


    test('Cart Badge Should Show Same Number of Added Items',  async({page}) => {
    
        await productPage.clickAProduct(3);

        await productDetailsPage.selectSize('L');
        await productDetailsPage.clickAddToCartButton();

        const badgeNumber = page.getByTestId('cart-badge')
        await expect(badgeNumber).toHaveText('1');

        await productDetailsPage.clickReturnButton();
        await productPage.clickAProduct(11);

        await productDetailsPage.selectSize('M');
        await productDetailsPage.clickIncreaseButton();
        await productDetailsPage.clickDecreaseButtton();
        await productDetailsPage.clickAddToCartButton();

        await expect(badgeNumber).toHaveText('2');
    })


    test('Cart Badge displays 99+ when total exceeds 99', async({page}) => {

        await productPage.clickAProduct(7);

        await productDetailsPage.selectSize('S');

        await productDetailsPage.increaseQuantity(9);
        await productDetailsPage.addToCartTimes(10);

        await productDetailsPage.clickAddToCartButton();

        const badgeNumber = page.getByTestId('cart-badge');

        await expect(badgeNumber).toHaveText('99+');
    })


    test('Cart Badge displays 99 at the boundary', async({page}) => {

        await productPage.clickAProduct(7);

        await productDetailsPage.selectSize('S');

        await productDetailsPage.increaseQuantity(9);
        await productDetailsPage.addToCartTimes(9);
        await productDetailsPage.clickDecreaseButtton();

        await productDetailsPage.clickAddToCartButton();

        const badgeNumber = page.getByTestId('cart-badge');

        await expect(badgeNumber).toHaveText('99');
    })
})