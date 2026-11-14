const HomePage = require('../pages-objects/HomePage');
const ProductPage = require('../pages-objects/ProductsPage');
const ProductDetailsPage = require('../pages-objects/ProductDetailsPage');
const {test, expect} = require('@playwright/test');

test.describe('Testing Product Details Page', () => {
    let homePage;
    let productsPage;
    let productDetailsPage;

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        productsPage = new ProductPage(page);
        productDetailsPage = new ProductDetailsPage(page);

        await homePage.openHomePage();
        await homePage.clickProductsLink();
    })

    test('Page Details Page Loads', async ({page}) => {

        await productsPage.clickAProduct(1);

        await expect(page).toHaveURL('http://localhost:3000/products/1');

        await productDetailsPage.clickReturnButton();

        await expect(page).toHaveURL('http://localhost:3000/products');
    })

    test('Product Details Page have name, price, image', async({page}) => {

        await productsPage.clickAProduct(12);

        const image = page.getByAltText('Near-black urban t-shirt with scattered blue dots');
        await expect(image).toBeVisible();

        const name = page.getByTestId('product-title');
        await expect(name).toHaveText('Night Shift Tee')

        const price = page.getByTestId('product-price');
        await expect(price).toHaveText('$29.50');
    })

    test('Product Details Page size buttons sould be clickable only one', async({page}) => {

        await productsPage.clickAProduct(5);

        await productDetailsPage.selectSize('S');

        await expect(productDetailsPage.sizeS).toBeChecked();

        await productDetailsPage.selectSize('M');

        await expect(productDetailsPage.sizeM).toBeChecked();
        await expect(productDetailsPage.sizeS).not.toBeChecked();
    })
})
