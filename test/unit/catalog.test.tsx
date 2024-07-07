import React from 'react';

import {render, screen, waitFor} from '@testing-library/react';
import {initStore} from "../../src/client/store";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import {MemoryRouter} from "react-router-dom";
import {MockCartApi, MockExampleApi} from "../mocks";

describe('страничка Catalog', () => {
    it('товары с бека отрисовываются на страничке Catalog', async () => {
        const basename = '/';

        const api = new MockExampleApi(basename);
        const cart = new MockCartApi({});
        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={['/catalog']}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </MemoryRouter>
        )

        const {container, getAllByTestId, getByRole} = render(application)

        expect(container.textContent).toContain('LOADING')

        await waitFor(() => {

            const [item1, item2] = [getAllByTestId('1')[1].lastChild, getAllByTestId('2')[1].lastChild]
            expect(item1.childNodes[0].textContent).toEqual('Product 1')
            expect(item1.childNodes[1].textContent).toEqual('$100')
            expect((item1.childNodes[2] as Element).getAttribute('href')).toEqual(`/catalog/1`)

            expect(item2.childNodes[0].textContent).toEqual('Product 2')
            expect(item2.childNodes[1].textContent).toEqual('$200')
            expect((item2.childNodes[2] as Element).getAttribute('href')).toEqual(`/catalog/2`)
        })
    })
});
