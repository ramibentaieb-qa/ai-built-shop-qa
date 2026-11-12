const HomePage = require('../pages-objects/HomePage');
const ProductsPage = require('../pages-objects/ProductsPage');
const {test, expect} = require('@playwright/test');

test.describe("Testing Products List", () => {

    test('Products Page Loads', async({page}) => {
        const homepage = new HomePage(page);
        await homepage.openHomePage();
        await homepage.clickProductsLink();

        const productsPage = new ProductsPage(page);
        const productsHeading = await productsPage.getProductsHeading();
        expect(productsHeading).toContain("Men's urban t-shirts");  
    })


    test('Products page should display all products cards with unique name, image, and price', async({page}) => {
        const homepage = new HomePage(page);
        await homepage.openHomePage();
        await homepage.clickProductsLink();

        const cards = page.getByTestId('product-card');
        await expect(cards).toHaveCount(12);

        const names = await page.getByTestId('product-name').allTextContents();
        expect(new Set(names).size).toBe(12);

        const images = page.getByTestId('product-image');
        await expect(images).toHaveCount(12);

        const prices = await page.getByTestId('product-price').allTextContents();
        expect(prices).toHaveLength(12);

        for (const price of prices) {
            expect(price).toMatch(/^\$\d+\.\d{2}$/);
        }
    })
})