import {CartState, CheckoutFormData} from "../src/common/types";

export const MockExampleApi = jest.fn().mockImplementation(() => {
    let curr_id_order = 0
    return {
        getProducts: jest.fn().mockResolvedValue({data: [
                { id: 1, name: 'Product 1', price: 100 },
                { id: 2, name: 'Product 2', price: 200 }
            ]}),
        getProductById: jest.fn().mockImplementation((id: number) => {
            const products = new Map(Object.entries( {
                1: { id: 1, name: 'Product 1', price: 100, description: 'Description 1', color: 'pink', material: 'cotton' },
                2: { id: 2, name: 'Product 2', price: 200, description: 'Description 2', color: 'blue', material: 'cotton'  }
            }));
            return Promise.resolve({data: products.get(id.toString())});
        }),
        checkout: jest.fn().mockImplementation((form: CheckoutFormData, cart: CartState) => {
            curr_id_order++
            return Promise.resolve({data: { id: curr_id_order }});
        })
    };
})

export const MockCartApi = jest.fn().mockImplementation((initialState: CartState) => {
    let cart: CartState = initialState

    return {
        getState: jest.fn().mockImplementation(() => {
            return cart
        }),
        setState: jest.fn().mockImplementation((new_cart: CartState) => {
            cart = new_cart
        })
    }
})

export type MockCartApiT = ReturnType<typeof MockCartApi>
