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
        this.io.on('connection',(socket)=>{
            console.log("Connection " + socket.id);
                io.emit('hola');
                io.to(socket.id).emit('conn', 0);
            //When host connects for the first time
            socket.on('host-join', (data) =>{
                console.log("Connection 2");
                //Check to see if id passed in url corresponds to id of kahoot game in database
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("kahootDB");
                    var query = { id:  parseInt(data.id)};
                    dbo.collection('kahootGames').find(query).toArray(function(err, result){
                        if(err) throw err;
                        
                        //A kahoot was found with the id passed in url
                        if(result[0] !== undefined){
                            var gamePin = Math.floor(Math.random()*90000) + 10000; //new pin for game

                            games.pGame(gamePin, socket.id, false, {playersAnswered: 0, questionLive: false, gameid: data.id, question: 1}); //Creates a game with pin and host id

                            var game = games.getGame(socket.id); //Gets the game data

                            socket.join(game.pin);//The host is joining a room based on the pin

                            console.log('Game Created with pin:', game.pin); 

                            //Sending game pin to host so they can display it for players to join
                            socket.emit('showGamePin', {
                                pin: game.pin
                            });
                        }else{
                            socket.emit('noGameFound');
                        }
                        db.close();
                    });
                });
                
            });
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