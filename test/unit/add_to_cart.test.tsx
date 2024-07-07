import React from 'react';

import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import {initStore} from "../../src/client/store";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import {MemoryRouter} from "react-router-dom";
import {MockCartApi, MockCartApiT, MockExampleApi} from "../mocks";
import '@testing-library/jest-dom'

describe('тестирование добавления элемента в корзину', () => {
    let application: React.JSX.Element
    let cart: MockCartApiT

    beforeEach(() => {
        const basename = '/';

        const api = new MockExampleApi(basename);
        cart = new MockCartApi({});
        const store = initStore(api, cart);

        application = (
            <MemoryRouter initialEntries={['/catalog/1']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        )
    })

    it('если товар уже добавлен в корзину, на странице товара должно отображаться сообщение об этом', async () => {

        const {container, getByText} = render(application)

        await waitFor(() => {

        })

        const addButton = getByText('Add to Cart')
        fireEvent.click(addButton)
        // const span = getByText('Item in cart')

        expect(container.textContent).toContain('Item in cart')
    })
    it('если товар уже добавлен в корзину, на странице всех товаров должно отображаться сообщение об этом', async () => {

        const {getByText, getAllByTestId} = render(application)

        await waitFor(() => {

        })

        const addButton = getByText('Add to Cart')
        fireEvent.click(addButton)
        const catalog_link = getByText('Catalog')
        fireEvent.click(catalog_link)

        await waitFor(() => {

        })

        expect(getAllByTestId(1)[1].textContent).toContain('Item in cart')
    })
    it('при нажатии кнопки Add to cart количество товара в корзине должно увеличиться', async () => {

        const { getByText} = render(application)

        await waitFor(() => {

        })

        const addButton = getByText('Add to Cart')
        fireEvent.click(addButton)
        expect(cart.getState()['1']?.count === 1).toBeTruthy()
        fireEvent.click(addButton)
        expect(cart.getState()['1']?.count === 2).toBeTruthy()
        fireEvent.click(addButton)
        expect(cart.getState()['1']?.count === 3).toBeTruthy()

    })
});
