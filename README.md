# platziverse-agent

## Usage

``` js
const PlatziverseAgent = require('platziverse-agent')

const agent = new PlatziverseAgent({
    interval:2000// A cada 200 ms enviar mensaje
});

agent.connect()

agent.on('agent/message', payload =>{
    console.log(payload)
})

setTimeout(()=>agent.disconnected(),20000)

```