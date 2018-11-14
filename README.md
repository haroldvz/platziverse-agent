# platziverse-agent

## Usage

``` js
const PlatziverseAgent = require('platziverse-agent')

const agent = new PlatziverseAgent()

agent.connect()

agent.on('agent/message', payload =>{
    console.log(payload)
})

setTimeout(()=>agent.disconnected(),20000)

```