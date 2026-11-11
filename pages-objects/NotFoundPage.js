const BasePage = require('./BasePage');

class NotFoundPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async openUnknownPage() {
        return await this.navigate('http://localhost:3000/abc123'); 
    }

    async getHeadingText() {
        return await this.getText('h1');
    }

}

module.exports = NotFoundPage;