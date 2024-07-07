import React from 'react';

import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import {initStore} from "../../src/client/store";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import {MemoryRouter} from "react-router-dom";
import {MockCartApi, MockCartApiT, MockExampleApi} from "../mocks";
import '@testing-library/jest-dom'

describe('тестирование шапки страницы', () => {
    let application: React.JSX.Element
    let cart: MockCartApiT

    beforeAll(() => {
        const basename = '/';

        const api = new MockExampleApi(basename);
        cart = new MockCartApi({});
        const store = initStore(api, cart);

        application = (
            <MemoryRouter initialEntries={['/']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        )
    })

    it('название магазина в шапке должно быть ссылкой на главную страницу', () => {
        const {getByRole} = render(application)

        const home_link = getByRole('link', {name: /kogtetochka store/i})
        expect(home_link).toBeInTheDocument()
    })
    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
        const {getByRole} = render(application)

        const catalog_link = getByRole('link', {name: /catalog/i})
        expect(catalog_link).toBeInTheDocument()

        const delivery_link = getByRole('link', {name: /delivery/i})
        expect(delivery_link).toBeInTheDocument()

        const contacts_link = getByRole('link', {name: /contacts/i})
        expect(contacts_link).toBeInTheDocument()

        const cart_link = getByRole('link', {name: /cart/i})
        expect(cart_link).toBeInTheDocument()
    })
    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', () => {
        const {getByRole} = render(application)

        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 575 });
        Object.defineProperty(window, 'outerWidth', { writable: true, configurable: true, value: 575 });
        window.dispatchEvent(new Event('resize'));

        const button = getByRole('button', {
            name: /toggle navigation/i
        })
        expect(button.style.display === 'none').toBeFalsy()

    })
    it('на ширине >= 576px навигационное меню не должно скрываться за "гамбургер"', () => {
        const {getByRole} = render(application)

        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 576 });
        Object.defineProperty(window, 'outerWidth', { writable: true, configurable: true, value: 576 });
        window.dispatchEvent(new Event('resize'));

        const button = getByRole('button', {
            name: /toggle navigation/i
        })

        expect(!!button.style.display).toBeFalsy()
    })
    it('при выборе элемента из меню "гамбургера", меню должно закрываться',  () => {
        const {container, getByRole} = render(application)

        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 575 });
        Object.defineProperty(window, 'outerWidth', { writable: true, configurable: true, value: 575 });
        window.dispatchEvent(new Event('resize'));

        const button = getByRole('button', {
            name: /toggle navigation/i
        })
        const delivery_link = getByRole('link', {name: /delivery/i})

        fireEvent.click(button)
        fireEvent.click(delivery_link)

        const application_menu = container.querySelector('.collapse')

        expect(application_menu).toBeTruthy()
    })
});
