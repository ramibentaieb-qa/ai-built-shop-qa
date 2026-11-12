const BasePage = require ('./BasePage');

class ProductsPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async getProductsHeading() {
        return await this.getText('header h1');
    } 




}

module.exports = ProductsPage;