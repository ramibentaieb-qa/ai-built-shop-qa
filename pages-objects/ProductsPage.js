const BasePage = require ('./BasePage');

class ProductsPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async getProductsHeading() {
        return await this.getText('header h1');
    } 

    async clickAProduct(productId) {
        await this.page.locator(`a[href='/products/${productId}']`).first().click();
    }




}

module.exports = ProductsPage;