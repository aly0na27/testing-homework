import React from 'react';

import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import {initStore} from "../../src/client/store";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import {MemoryRouter} from "react-router-dom";
import {MockCartApi, MockExampleApi} from "../mocks";

describe('тестирование странцы информации о товаре', () => {
    it('данные товара корректно отрисовываются на страничке Details', async () => {
        const basename = '/hw/store';

        const api = new MockExampleApi(basename);
        const cart = new MockCartApi({});
        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={[`/catalog`]}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        )

        const {container, getAllByText} = render(application)

        expect(container.textContent).toContain('LOADING')

        await waitFor(() => {

        })

        const details_href= getAllByText('Details')[1]
        fireEvent.click(details_href)

        await waitFor(() => {

        })

        const product = store.getState().details['2']
        expect(container.getElementsByClassName('ProductDetails-Name')[0].textContent).toEqual(product.name)
        expect(container.getElementsByClassName('ProductDetails-Description')[0].textContent).toEqual(product.description)
        expect(container.getElementsByClassName('ProductDetails-Price')[0].textContent).toEqual('$' + product.price)
        expect(container.getElementsByClassName('ProductDetails-Color')[0].textContent).toEqual(product.color)
        expect(container.getElementsByClassName('ProductDetails-Material')[0].textContent).toEqual(product.material)
        expect(container.getElementsByClassName('ProductDetails-AddToCart')[0].textContent).toEqual('Add to Cart')
    })
});
