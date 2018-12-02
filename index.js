'use strict'


const debug = require('debug')('platziverse:agent')
const mqtt = require('mqtt')// client
const defaults = require('defaults')
const EventEmitter = require('events')// from node core
const uuid = require('uuid')
const { parsePayload } = require('./utils')
const os = require('os')
const util = require('util')

const options = {
    name: 'untitled',
    username: 'platzi',
    interval: 5000,
    mqtt: {
        host: 'mqtt://localhost'
    }
}

class PlatziverseAgent extends EventEmitter {

    constructor(opts) {
        super()
        this._started = false// Identifica si el timer ha arrancado
        this._timer = null
        this._options = defaults(opts, options)// le aplico las opts nuevas y si no tiene las que vienen por defecto
        this._client = null
        this._agentId = null
        this._metrics = new Map()
    }

    addMetric(type, func) {
        this._metrics.set(type, func)
    }

    removeMetric(type) {
        this._metrics.delete(type)
    }

    connect() {
        if (!this._started) {
            this._started = true
            const opts = this._options
            this._client = mqtt.connect(opts.mqtt.host)
            // Este mismo cliente notifica cuando se reciban mensajes del servidor mqtt 
            this._client.subscribe('agent/message')
            this._client.subscribe('agent/connected')
            this._client.subscribe('agent/disconnected')

            this._client.on('connect', () => {
                this._agentId = uuid.v4()
                this.emit('connected', this._agentId)// solo para este agente, no se trasnmite al servidor mqtt
                this._timer = setInterval(async () => {
                    let message = {}
                    if (this._metrics.size > 0) {
                        message = {
                            agent: {
                                uuid: this._agentId,
                                username: opts.username,
                                name: opts.name,
                                hostname: os.hostname() || 'localhost',
                                pid: process.pid
                            },
                            metrics: [],
                            timestamp: new Date().getTime()
                        }

                    }

                    for (let [metric, fn] of this._metrics) {
                        if (fn.legnth == 1) {
                            fn = util.promisify(fn)
                        }

                        message.metrics.push({
                            type: metric,
                            value: await Promise.resolve(fn())
                        })
                        debug('Sending', message)
                        this._client.publish('agent/message', JSON.stringify(message))
                        this.emit('message',message)
                    }

                    this.emit('agent/message', 'This is a message')
                }, opts.interval)
            })

            this._client.on('message', (topic, payload) => {

                payload = parsePayload(payload)

                let broadcast = false // por defecto no se retrasmite el mensaje

                switch (topic) {
                    case 'agent/connected':
                    case 'agent/disconnected':
                    case 'agent/message':
                        broadcast = payload && payload.agent && payload.agent.uuid !== this._agentId
                        break
                    default:
                        break
                }

                if (broadcast) {
                    this.emit(topic, payload)
                }



            })

            this._client.on('error', () => this.disconnect())
        }
    }

    disconnect() {
        if (this._started) {
            clearInterval(this._timer)
            this._started = false
            this.emit('disconnected',this._agentId)
            this._client.end()
        }
    }

}

module.exports = PlatziverseAgent