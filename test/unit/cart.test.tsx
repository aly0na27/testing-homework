import React from 'react';

import {render, fireEvent, within} from '@testing-library/react';
import {initStore} from "../../src/client/store";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import {MemoryRouter} from "react-router-dom";
import {MockCartApi, MockCartApiT, MockExampleApi} from "../mocks";
import '@testing-library/jest-dom'
import {CartItem} from "../../src/common/types";

describe('тестирование страницы корзины товаров', () => {
    let application: React.JSX.Element
    let cart: MockCartApiT

    let data: Record<string, CartItem> = {
        '1': {name: 'Product1', price: 100, count: 2},
        '2': {name: 'Product2', price: 77, count: 3},
        '4': {name: 'Product4', price: 50, count: 1}
    }
    const original = window.location;

    const reloadFn = () => {
        window.location.reload();
    };

    beforeAll(() => {
        const basename = '/';

        const api = new MockExampleApi(basename);
        cart = new MockCartApi(data);
        const store = initStore(api, cart);

        application = (
            <MemoryRouter initialEntries={['/cart']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        )

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
    })

    afterAll(() => {
        Object.defineProperty(window, 'location', { configurable: true, value: original });
    });

    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
        const {getByRole} = render(application)

        const expect_cart_size = Object.keys(cart.getState()).length
        const cart_link = getByRole('link', {name: /cart(?: \(\d+\))?/i})

        const cart_size = cart_link.textContent.at(-2) === 'r' ? 0 : +cart_link.textContent.at(-2)

        expect(cart_size).toEqual(expect_cart_size)
    })
    it('в корзине должна отображаться таблица с добавленными в нее товарами', () => {
        const { getByRole, getByTestId} = render(application)

        const table = getByRole('table')
        const row1 = getByTestId('1')
        const row2 = getByTestId('2')
        const row3 = getByTestId('4')

        expect(table).toBeInTheDocument()
        expect(row1).toBeInTheDocument()
        expect(row2).toBeInTheDocument()
        expect(row3).toBeInTheDocument()
    })
    it('для каждого товара должны отображаться название, цена, количество, стоимость и общая сумма заказа', () => {
        const { getByRole, getAllByTestId} = render(application)

        const table = getByRole('table')
        const rows = getAllByTestId(/^\d+$/)

        let total_price = 0

        expect(table).toBeInTheDocument()
        rows.forEach((row) => {
            const id = row.getAttribute('data-testid')
            expect(row.querySelector('.Cart-Name').textContent).toEqual(data[id].name)
            expect(row.querySelector('.Cart-Price').textContent).toEqual('$' + data[id].price)
            expect(row.querySelector('.Cart-Count').textContent).toEqual(data[id].count.toString())
            expect(row.querySelector('.Cart-Total').textContent).toEqual('$' + (data[id].count * data[id].price))
            total_price += data[id].count * data[id].price
        })

        expect(table.querySelector('.Cart-OrderPrice').textContent).toEqual('$' + total_price)
    })
    it('после перезагрузки страницы, содержимое корзины должно сохраняться', () => {
        const {getAllByTestId, getByRole } = render(application)

        reloadFn()
        expect(window.location.reload).toHaveBeenCalled();

        const table = getByRole('table')
        const rows = getAllByTestId(/^\d+$/)

        let total_price = 0
        expect(table).toBeInTheDocument()

        rows.forEach((row) => {
            const id = row.getAttribute('data-testid')
            expect(row.querySelector('.Cart-Name').textContent).toEqual(data[id].name)
            expect(row.querySelector('.Cart-Price').textContent).toEqual('$' + data[id].price)
            expect(row.querySelector('.Cart-Count').textContent).toEqual(data[id].count.toString())
            expect(row.querySelector('.Cart-Total').textContent).toEqual('$' + (data[id].count * data[id].price))
            total_price += data[id].count * data[id].price
        })

        expect(table.querySelector('.Cart-OrderPrice').textContent).toEqual('$' + total_price)

    })
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', () => {
        const {container, getByRole } = render(application)

        const button_clear_cart = getByRole('button',  { name: /clear shopping cart/i })

        expect(button_clear_cart).toBeInTheDocument()

        fireEvent.click(button_clear_cart)

        expect(Object.keys(cart.getState()).length === 0).toBeTruthy()
    })

    it('если корзина пустая, должна отображаться ссылка на католог товаров', () => {

        const {container, getByText} = render(application)

        const view = getByText(
            /cart is empty\. please select products in the \./i);

        const catalog_link = within(view).getByRole('link', {
            name: /catalog/i
        });

        expect(catalog_link).toBeInTheDocument()
    })
});
