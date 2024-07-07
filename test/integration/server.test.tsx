import http from 'http'
import express from "express";
import {router} from "../../src/server/routes";
import {ProductShortInfo} from "../../src/common/types";

const app = express();

app.use(express.json());
app.use('/api', router);



const httpRequest = (options: any, postData: any) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (postData) {
            req.write(postData);
        }

        req.end();
    });
};

describe('тестирование бекенд сервера', () => {
    let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

    beforeAll(done => {
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll(done => {
        server.close(done);
    });

    it('тестирование ручки /api/products', async() => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/hw/store/api/products', //можно передать сюда bug_id=1
            method: 'GET',
        };

        const response = await httpRequest(options, null);
        const result: ProductShortInfo[] = JSON.parse(response as string)
        expect(result[0].name && result[0].name.length > 0).toBeTruthy()

    })
    it('тестирование ручки /api/products/id', async () => {

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/hw/store/api/products/2', //можно передать сюда bug_id=3
            method: 'GET',
        };

        const response = await httpRequest(options, null);
        expect(JSON.parse(response as string)['id']).toEqual(2)
    })
    it('при создании заказа id последнего элемента списка заказов должно быть равно id создаанного заказа', async () => {
        const postData = JSON.stringify({
            form: {
                "name": "Alyona",
                "phone": "79110629203",
                "address": "hehe"
            },
            cart: {
                "0": {"name": "Electronic kogtetochka", "price": 196, "count": 100}
            }
        })

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/hw/store/api/checkout', //можно передать сюда bug_id=2
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        }

        const options2 = {
            hostname: 'localhost',
            port: 3000,
            path: '/hw/store/api/orders',
            method: 'GET',
        }

        const response1 = await httpRequest(options, postData) as string
        // console.log(response1)
        // const response2 = await httpRequest(options, postData) as string

        const response3 = await httpRequest(options2, null) as string
        const orders = JSON.parse(response3)

        expect(orders.length !== 0).toBeTruthy()
        expect(JSON.parse(response1).id === orders.at(-1).id ).toBeTruthy()
    })
});
                                