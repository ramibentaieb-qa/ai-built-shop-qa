const HomePage = require('../pages-objects/HomePage');
const ProductPage = require('../pages-objects/ProductsPage');
const ProductDetailsPage = require('../pages-objects/ProductDetailsPage');
const {test, expect} = require('@playwright/test');

test.describe('Testing Product Details Page', () => {

    test('Page Details Page Loads', async ({page}) => {
        const homePage = new HomePage(page);
        await homePage.openHomePage();
        homePage.clickProductsLink();

        const productsPage = new ProductPage(page);
        await productsPage.clickAProduct(1);

        
        await expect(page).toHaveURL('http://localhost:3000/products/1');

        const productsDetailsPage = new ProductDetailsPage(page);
        await productsDetailsPage.clickReturnButton();

        await expect(page).toHaveURL('http://localhost:3000/products');
    })

    test('Product Details Page have name, price, image', async({page}) => {
        const homePage = new HomePage(page);
        await homePage.openHomePage();
        homePage.clickProductsLink();

        const productsPage = new ProductPage(page);
        await productsPage.clickAProduct(12);

        const image = page.getByAltText('Near-black urban t-shirt with scattered blue dots');
        await expect(image).toBeVisible();

        const name = page.getByTestId('product-title');
        await expect(name).toHaveText('Night Shift Tee')

        const price = page.getByTestId('product-price');
        await expect(price).toHaveText('$29.50');
    })

    test('Product Details Page size buttons sould be clickable only one', async({page}) => {
        const homePage = new HomePage(page);
        await homePage.openHomePage();
        homePage.clickProductsLink();

        const productsPage = new ProductPage(page);
        await productsPage.clickAProduct(5);

        const productDetailsPage = new ProductDetailsPage(page);
        await productDetailsPage.selectSize('S');

        await expect(productDetailsPage.sizeS).toBeChecked();

        await productDetailsPage.selectSize('M');

        await expect(productDetailsPage.sizeM).toBeChecked();
        await expect(productDetailsPage.sizeS).not.toBeChecked();


    })
})
