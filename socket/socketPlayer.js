const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/";

class socketPlayer {

    constructor(){}

    hostJoin(socket) {
        return socket.on('host-join', (data) =>{
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
    }

    playerHostJoin(socket) {
        return socket.on('host-join-game', (data) => {
            var oldHostId = data.id;  
            var gamepin2 = Math.floor(Math.random()*90000) + 10000; //new pin for game
            console.log(data+" id encontrado, id generado... "+gamepin2+" socket id: "+socket.id);
            games.addGame(gamepin2,socket.id,76);
            io.to(socket.id).emit('hola',{n: gamepin2 });
            io.to(socket.id).emit('conn');
            console.log("enviado");
        });
    }


}