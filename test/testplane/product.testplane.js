describe('тестирование карточки товара', function() {
    it('при клике на кнопку товар добавляется в корзину', async ({browser}) => {
        await browser.url('http://localhost:3000/hw/store/catalog/4');

        await browser.$('.ProductDetails-AddToCart').click()

        const expected_text = await browser.$('.CartBadge').getText()

        expect(expected_text).toEqual('Item in cart')

        await browser.url('http://localhost:3000/hw/store/catalog')

        const expected_text2 = await browser.$$('.row')[1].$$('.col-12')[4].$('.CartBadge')

        expect(!!expected_text2.error).toBeFalsy()

        const res = await expected_text2.getText()

        expect(res).toEqual('Item in cart')

    });

})