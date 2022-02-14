const express = require('express')
const tracing = require('./tracer')
const tracer = tracing("service-D")

const app = express()

const Client = require('./client').Client
const get = async (url, port) => {
    const client = new Client(port, tracer)
    try{
        const res = await client.get(url)
        return res.data
    }
    catch{
        return 'value_not_available'
    }
}
const getC = () => get('/c2', 8003)
const getInvalid = () => get('/invalid', 8013)

app.get('/d', async (req, res) => {
    const [c2, invalid] = await Promise.all([getC(), getInvalid()])
    res.json({
        d: Math.random(),
        ...c2,
        ...invalid
    })
    res.send()
})

app.listen(8004, () => {
    console.log('service b started on 8004')
})