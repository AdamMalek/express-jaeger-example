const tracing = require('./tracer')
const tracer = tracing("service-A")
const { default: axios } = require('axios')
const express = require('express')
const Client = require('./client').Client
const app = express()

const get = async (url, port) => {
    const client = new Client(port, tracer)
    return await client.get(url)
}

const getBC = () => get('/bc', 8002)
const getD = async () => get('/d', 8004)

app.get('/start', async (req, res) => {
    const a = Math.random()
    const [bc, d] = await Promise.all([getBC(), getD()])

    res.json({
        a,
        b: bc.data.b,
        c: bc.data.c,
        d: d.data.d,
        d_c2: d.data.c2
    })

    res.end()
})

app.listen(8001, () => {
    console.log('service a started on 8001')
})
