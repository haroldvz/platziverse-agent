'use strict'

const EventEmitter = require('events')// from node core

class PlatziverseAgent extends EventEmitter{

    constructor(opts){
        super()
        this._started = false// Identifica si el timer ha arrancado
        this._timer = null
        this._options = opts
    }

    connect() {
        if(!this._started){
            this._started = true
            this.emit('connected')
            const opts = this._options
            this._timer = setInterval(()=>{
                this.emit('agent/message','This is a message')
            }, opts.interval)
        }
    }

    disconnect() {
        if(this._started){
            clearInterval(this._timer)
            this._started = false
            this.emit('disconnected')
        }
    }

}

module.exports = PlatziverseAgent