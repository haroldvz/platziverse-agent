# platziverse-agent

## Usage

``` js
const PlatziverseAgent = require('platziverse-agent')

const agent = new PlatziverseAgent({
    name: 'myapp',
    username: 'admin',
    interval:2000// A cada 200 ms enviar mensaje
})

agent.addMetric('rss',function getRss(){
    return process.memoryUsage().rss
})

agent.addMetric('PromiseMetric',function getRandomPromise(){
    return Promise.resolve(Math.random())
})

agent.addMetric('callbackMetric',function getRandomCallback(){
    setTimeout(()=>{
        callback(null,Math.random())
    },1000)
})

agent.connect()
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)

agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', handler)

agent.on('agent/message', payload =>{
    console.log(payload)
})

function handler(){
    console.log(payload)
}

setTimeout(()=>agent.disconnected(),20000)

```