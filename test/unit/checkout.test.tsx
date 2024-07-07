import React from 'react';

import {render, waitFor, screen, fireEvent, within} from '@testing-library/react';
import {initStore} from "../../src/client/store";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import {MemoryRouter} from "react-router-dom";
import {MockCartApi, MockCartApiT, MockExampleApi} from "../mocks";
import '@testing-library/jest-dom'
import {CartItem} from "../../src/common/types";

describe('тестирование формы', () => {
    let application: React.JSX.Element
    let cart: MockCartApiT

    let data: Record<string, CartItem> = {
        '1': {name: 'Product1', price: 100, count: 2},
        '2': {name: 'Product2', price: 77, count: 3},
        '4': {name: 'Product4', price: 50, count: 1}
    }

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
    })

    it('после заполнения и отправки формы, отображается информация об успешно выполненом заказе', async () => {
        const {container, getByRole, getByLabelText} = render(application)

        const input_name = getByLabelText('Name') as HTMLInputElement
        const input_phone = getByLabelText('Phone') as HTMLInputElement
        const textarea_address = getByLabelText('Address') as HTMLTextAreaElement
        const button_submit = getByRole('button', {name: /checkout/i})

        fireEvent.change(input_name, {target: {value: 'Алена'}})
        fireEvent.change(input_phone, {target: {value: '79999999999'}})
        fireEvent.change(textarea_address, {target: {value: 'Мурманская область, город Заполярный'}})

        fireEvent.click(button_submit)

        await waitFor(() => {
        })

        const cart_message = container.querySelector('.Cart-SuccessMessage')

        expect(cart_message).toBeInTheDocument()
        expect(cart_message.getAttribute('class').split(' ').includes('alert-success')).toBeTruthy()
        expect(container.querySelector('.Cart-Number').textContent).toEqual('1')
    })
});
