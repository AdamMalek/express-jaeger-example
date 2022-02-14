const axios = require('axios');
const api = require('@opentelemetry/api');

class Client {
    constructor(port, tracer) {
        this.client = axios;
        this.port = port;
        this.tracer = tracer;
        this.insideSpan = insideSpan(this.tracer);
    }

    async get(url) {
        return this.insideSpan('client.makeRequest()', async () => {
            const fullUrl = 'http://localhost:' + this.port + url;
            return await axios.get(fullUrl);
        });
    }
}

const insideSpan = tracer => (actionName, action) => {
    const span = tracer.startSpan(actionName, {
        kind: api.SpanKind.CLIENT
    });

    return api.context.with(api.trace.setSpan(api.ROOT_CONTEXT, span), async () => {
        let res = undefined;
        try {
            res = await action();
            span.setStatus({ code: api.SpanStatusCode.OK });
        } catch (e) {
            console.log('failed:', e.message);
            span.setStatus({ code: api.SpanStatusCode.ERROR, message: e.message });
            span.setAttributes({ testProperty: 'test-value' });
        }
        span.end();
        return res;
    });
};

module.exports = { Client, insideSpan };
