const BasePage = require ('./BasePage');

class ProductDetailsPage extends BasePage {
    constructor(page) {
        super(page);

        this.sizeS = page.getByTestId('size-option-S');
        this.sizeM = page.getByTestId('size-option-M');
        this.sizeL = page.getByTestId('size-option-L');
        this.sizeXL = page.getByTestId('size-option-XL');
    }


    async getProductLink() {
        return await this.page.url();
    }

    async clickReturnButton() {
        await this.click('a[data-testid="back-to-products"]');
    }
 
    async selectSize(size) {
        await this.page.locator(`input[data-testid='size-option-${size}']`).check();
    }

    async isSizeSelected(size) {
        return await this.page.locator(`input[data-testid='size-option-${size}']`).isChecked();
    }

}
module.exports = ProductDetailsPage;