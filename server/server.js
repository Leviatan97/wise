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
        this.publicPath = path.join(__dirname, '../public')
        this.initialSetup()
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
            console.log("Connection " + socket.id);
            this.io.send(socket)
        })
    }

    listenPort() {
        const server = this.server_.listen(3000,()=>{
            console.log(`Server started on port 3000`)
        })
        return server
    }
}

module.exports = {server}