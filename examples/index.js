
const PlatziverseAgent = require('../index')

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

/*
agent.addMetric('callbackMetric',function getRandomCallback(callback){
    setTimeout(()=>{
        callback(null,Math.random())
    },1000)
})*/

agent.connect()

// This only agent
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)

// Other Agents
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', handler)

agent.on('agent/message', payload =>{
    console.log(payload)
})

function handler(payload){
    console.log(payload)
}

setTimeout(()=>agent.disconnect(),5000)