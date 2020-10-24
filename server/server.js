const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io')
const http = require('http')
const path = require('path')
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/";

class server {
    
    constructor(app, server_, io, publicPath) 
    {
        this.app = express()
        this.server_ = http.createServer(this.app)
        this.io = socketIO(this.server_)
        this.publicPath = path.join(__dirname, 'public')
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
        return this.io.on('connection',(socket)=>{
            console.log("Connection " + socket.id);
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