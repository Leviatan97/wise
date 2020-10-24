const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io')
const http = require('http')
const path = require('path')

class server {
    app
    constructor( 
        server_ = http.createServer(this.app), 
        io = socketIO(this.server_), 
        publicPath = path.join(__dirname, 'public')
        ) 
    {
        this.app = express()
        this.initialSetup()
        this.setPort()
        this.listenPort()
        this.socketSetup()
    }

    initialSetup() {
        this.app.use(cors({ origin: true, credentials: true }))
        this.app.use(express.json())
        this.app.use(express.static(this.publicPath));
    }

    socketSetup() {
        this.io.on('connection',(socket)=>{
            console.log('conectado')
            this.io.emit('funciona','funciona')
        })
    }

    setPort() {
        this.app.set('port',3000)
    }

    listenPort() {
        const server = this.app.listen(this.app.get('port'),()=>{
            console.log(`Server started on port ${this.app.get('port')}`)
        })
        return server
    }
}

module.exports = {server}