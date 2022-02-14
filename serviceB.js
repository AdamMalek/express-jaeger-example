const express = require('express')
const tracing = require('./tracer')
const tracer = tracing("service-B")

const app = express()

const Client = require('./client').Client
const get = async (url, port) => {
    const client = new Client(port, tracer)
    return await client.get(url)
}
const getC = () => get('/c', 8003)

app.get('/bc', async (req, res) => {
    const c = await getC()
    const b = Math.random()
    res.json({
        b,
        c: c.data.c
    })
    res.send()
})

app.get('/b2', async (req, res) => {
    const b2 = Math.random()
    res.json({
        b2,
    })
    res.send()
})

app.listen(8002, () => {
    console.log('service b started on 8002')
})