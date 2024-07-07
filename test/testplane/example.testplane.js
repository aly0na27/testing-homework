
describe('скриншотные тесты статических страниц', function() {
    it('скриншотный тест главной страницы', async ({ browser }) => {
        await browser.url('http://localhost:3000/hw/store');

        let home_page = await browser.$('.Home');

        await home_page.assertView('plain')
    });
    it('скриншотный тест страницы "Delivery"', async ({browser}) => {
        await browser.url('http://localhost:3000/hw/store/delivery');

        let delivery_page = await browser.$('.Delivery');

        await delivery_page.assertView('plain')
    });
    it('скриншотный тест страницы "Contacts"', async ({browser}) => {
        await browser.url('http://localhost:3000/hw/store/contacts');

        let delivery_page = await browser.$('.Contacts');

        await delivery_page.assertView('plain')
    });
    it('скриншотный тест кнопки "Add to Cart"', async ({ browser }) => {
        await browser.url('http://localhost:3000/hw/store/catalog/0'); //сюда можно добавить bug_id=9

        let delivery_page = await browser.$('.ProductDetails-AddToCart');

        await delivery_page.assertView('plain')
    });
});
