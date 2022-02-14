const express = require('express');
const tracing = require('./tracer');
const tracer = tracing('service-C');
const { Client, insideSpan:spanFactory} = require('./client');

const app = express();

const insideSpan = spanFactory(tracer)

const get = async (url, port) => {
    const client = new Client(port, tracer)
    return await client.get(url)
}
const getB2 = () => get('/b2', 8002)

app.get('/c', async (req, res) => {
    await insideSpan('get C', async () => {
        res.json({
            c: Math.random()
        });
        res.send();
    });
});

app.get('/c2', async (req, res) => {
    await insideSpan('get C2', async () => {
        const b2 = await getB2()
        res.json({
            b2: b2.data.b2,
            c2: Math.random()
        });
        res.send();
    });
});

app.listen(8003, () => {
    console.log('service c started on 8003');
});
