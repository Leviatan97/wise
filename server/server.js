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

            //When player connects for the first time
            socket.on('player-host-join', (params) => {
                console.log('entro host');
                //For each game in the Games class
                for(var i = 0; i < games.games.length; i++){
                    //If the pin is equal to one of the game's pin
                    if(params.pin == games.games[i].pin){                
                        console.log('Player connected to game');                
                        var hostId = games.games[i].hostId; //Get the id of host of game              
                        players.addPlayer(hostId, socket.id, params.nameID, params.profilePic,games.games[i].currPosToInit); //add player to game               
                        games.games[i].currPosToInit++;
                    }
                }       
                
            });
            
            //When the host connects from the game view
            socket.on('host-join-game', (data) => {
                var oldHostId = data.id;  
                var gamepin2 = Math.floor(Math.random()*90000) + 10000; //new pin for game
                console.log(data+" id encontrado, id generado... "+gamepin2+" socket id: "+socket.id);
                games.addGame(gamepin2,socket.id,76);
                io.to(socket.id).emit('hola',{n: gamepin2 });
                io.to(socket.id).emit('conn');
                console.log("enviado");
            });
            socket.on('minigameDice', (params) => {
                var player = players.getPlayer(socket.id);
                    var game = games.getGame(player.hostId); //Gets the game data
                    var playersInGame = players.getPlayers(player.hostId);
                    for(var n = 0; n < playersInGame.length; n++){
                            io.to(playersInGame[n].playerId).emit('minigamedice', 1);//Sending players old and new sockets                                     
                    }
            });
            socket.on('updatePlayerSocketId', (params) => {
                var player = players.getPlayer(params.oldId);
                if(player)
                {
                    players.updatePlayerId(socket.id, params.oldId);       
                    var game = games.getGame(player.hostId); //Gets the game data
                    var playersInGame = players.getPlayers(player.hostId);
                    io.to(player.playerId).emit('refreshBallots', game.activeBallots);//Sending player all ballots 
                    var sockets = new Array(params.oldId, socket.id);
                    for(var n = 0; n < playersInGame.length; n++){
                            io.to(playersInGame[n].playerId).emit('updatePlayerId', sockets);//Sending players old and new sockets                                     
                    }
                    console.log("player cambio su Id de: "+params.oldId+" a: "+ socket.id); 
                }
            });
            //When the host connects from the game view
            socket.on('test', (data) => {
                console.log("oprimio w");
                io.to(socket.id).emit('w', 0);//Sending player all ballots 
            });
            socket.on('reset', (data) => {
                console.log("el jugador no esta en linea, se sincronizo la posicion");
                io.to(socket.id).emit('resetp', 0);//Sending player all ballots 
            });
            socket.on('kick', (data) => {
            //  console.log("el jugador realizo un golpe- sin exito + salud: 100 + energia: 100 + arma: fierrote+1");
                io.to(socket.id).emit('bad', 0);//Sending player all ballots 
            });
            socket.on('refreshingRequest', (params) => {
                var player = players.getPlayer(socket.id);
                    var game = games.getGame(player.hostId); //Gets the game data
                io.to(player.playerId).emit('refreshBallots', game.activeBallots);//Sending player all ballots 
            });
            //When the host connects from the game view
            socket.on('test', (data) => {
                console.log("test");
            });
            //When player connects for the first time
            socket.on('player-join', (params) => {
                console.log('entra '+params.nameID +' '+params+' '+params.pin);
                var gameFound = false; //If a game is found with pin provided by player
                
                //For each game in the Games class
                for(var i = 0; i < games.games.length; i++){
                    //If the pin is equal to one of the game's pin
                    if(params.pin == games.games[i].pin){
                        
                        console.log('Player connected to game');
                        
                        var hostId = games.games[i].hostId; //Get the id of host of game
                        
                        
                        players.addPlayer(hostId, socket.id, params.nameID, params.profilePic,games.games[i].currPosToInit); //add player to game               
                        games.games[i].currPosToInit++;
                        socket.join(params.pin); //Player is joining room based on pin
                        
                        var playersInGame = players.getPlayers(hostId); 
                        console.log('Players connected '+playersInGame);
                        io.to(params.pin).emit('playerJoinGame', playersInGame);//Sending players data to display
                        io.to(hostId).emit('updateLobby', playersInGame);//Sending host player data to display
                        gameFound = true; //Game has been found
                    }else{
                        
                        console.log('no encontro lobby');
                    }
                }
                
                //If the game has not been found
                if(gameFound == false){
                        console.log('no encontro lobby');
                    socket.emit('noGameFound'); //Player is sent back to 'join' page because game was not found with pin
                }
                
                
            });
            
            socket.on('playerEnterGame', (params) => {
                var player = players.getPlayer(socket.id);
                if(player)
                {
                    console.log("callback from: "+player.nameId)
                    player.onGame = true;
                }
            });
            
            socket.on('host-start-bingo-game', (params) => {   
                var gameFound = false; //If a game is found with pin provided by player
                var gamePos;
                var hostId;
                var playersInGame;
                var paramsPin;
                var noBallotsLeft = new Boolean(false);
                console.log('entra bingo');
                //players.addPlayer(socket.id, socket.id, params.nameID); //add player to game
                //For each game in the Games class
                for(var i = 0; i < games.games.length; i++){
                    //If the pin is equal to one of the game's pin
                    if(params.pin == games.games[i].pin){
                        gamePos = i;
                        console.log('Host Start Game');
                        
                        hostId = games.games[i].hostId; //Get the id of host of game
                        paramsPin = params.pin;
                        playersInGame = players.getPlayers(hostId); 
                        io.to(params.pin).emit('gameStarted', playersInGame);//Sending players data to display
                        //io.to(hostId).emit('updateLobby', playersInGame);//Sending host player data to display
                        gameFound = true; //Game has been found
                    }
                    
                }       
                
            });
            socket.on('player-send-emoji', (params) => {
                var player = players.getPlayer(socket.id);        
                var game = games.getGame(player.hostId); //Gets the game data
                var playersInGame = players.getPlayers(player.hostId);
                    for(var n = 0; n < playersInGame.length; n++)
                    {
                        io.to(playersInGame[n].playerId).emit('emojiReceived', params);//Sending players a ballot                                     
                    }
            });
            socket.on('clear', (params) => {
                var player = players.getPlayer(socket.id);        
                var game = games.getGame(player.hostId); //Gets the game data        
                    clearInterval(game.intervalIdCB);
            });
            socket.on('endminigame', (params) => {
                console.log("ending minigame");
                var player = players.getPlayer(socket.id);        
                var game = games.getGame(player.hostId); //Gets the game data        
                game.onTurn = 1;
            });
            socket.on('clearInterval', (params) => {
            var player = players.getPlayer(socket.id);     
                var iterations = 0;
                var playerOnTurn;    
            var game = games.getGame(player.hostId); //Gets the game data
                        playerOnTurn = players.getPlayerByTurn(game.currTurn,player.hostId);  
                    clearInterval(game.intervalIdCB);
            var playersInGame = players.getPlayers(player.hostId);
                console.log('interval has been cleared: ');
                console.log('dice rolled for: '+playerOnTurn.nameId); 
                                var randNum = 0;
                                while(randNum==0){                            
                                randNum = Math.floor(Math.random() * 8);
                                    
                                }
                                    playerOnTurn.diceNumber = randNum;
                                for(var n = 0; n < playersInGame.length; n++)
                                {                       
                                    console.log('posicion actual: '+playerOnTurn.posOnBoard+'dado: '+playerOnTurn.diceNumber);
                                    io.to(playersInGame[n].playerId).emit('moveToSection', playerOnTurn);
                                    io.to(playersInGame[n].playerId).emit('autoDice', randNum);     
                                    if(playersInGame[n].onGame ==false)
                                    {
                                        console.log("player "+playersInGame[n].playerId+" i outside");
                                        io.to(playersInGame[n].playerId).emit('gameStarted', playersInGame);
                                    }
                                }                            
                                    playerOnTurn.posOnBoard = playerOnTurn.posOnBoard + randNum;
                    console.log('murio al final');
                        game.currTurn++;
                        if(game.currTurn>=playersInGame.length){
                        game.currTurn = 0;
                        }
                //    for(var n = 0; n < playersInGame.length; n++)
                //  {
                    //    io.to(playersInGame[n].playerId).emit('diceRoll', params);//Sending players a ballot                                     
                    //}        
            });
            socket.on('newTurn', (params) => {
                var player = players.getPlayer(socket.id);        
                var game = games.getGame(player.hostId); //Gets the game data        
                if(game.onTurn ==1){
                    game.onTurn = 0;
                var playersInGame = players.getPlayers(player.hostId);
                var iterations = 0;
                var playerOnTurn; 
                        for(var n = 0; n < playersInGame.length; n++)
                        {
                                if(playersInGame[n].onGame ==false)
                                {
                                    console.log("player "+playersInGame[n].playerId+" i outside");
                                    io.to(playersInGame[n].playerId).emit('gameStarted', playersInGame);
                                }
                        }
                if(typeof game.intervalIdCB === 'undefined'){         
                    console.log('murio al principio '+game.intervalIdCB);
                    clearInterval(game.intervalIdCB);
                }
                ///    for(var n = 0; n < playersInGame.length; n++)
                //    {
                //        io.to(playersInGame[n].playerId).emit('emojiReceived', params);//Sending players a ballot                                     
                //    }        
                var intervalID = setInterval(SetBallot, 10000);
                game.intervalIdCB = intervalID;
                
                function SetBallot() {
                    iterations++;
                    if(iterations<2){
                        playerOnTurn = players.getPlayerByTurn(game.currTurn,player.hostId);                       
                        console.log('Turn Setted for: '+playerOnTurn.nameId);
                        game.onTurn =1;
                        console.log('new cicle '+playersInGame.length);
                        for(var n = 0; n < playersInGame.length; n++)
                        {
                            console.log(playersInGame[n].playerId);
                                io.to(playersInGame[n].playerId).emit('playerTurn', playerOnTurn.playerId); 
                                if(playersInGame[n].onGame ==false)
                                {
                                    console.log("player "+playersInGame[n].playerId+" i outside");
                                    io.to(playersInGame[n].playerId).emit('gameStarted', playersInGame);
                                }
                        }
                    }
                        else{
                        game.currTurn++;
                        if(game.currTurn>=playersInGame.length){
                        game.currTurn = 0;
                        }
                            console.log('dice rolled for: '+playerOnTurn.nameId);
                                var randNum = 0;
                                while(randNum==0){                            
                                randNum = Math.floor(Math.random() * 8);
                                    
                                }
                                    playerOnTurn.diceNumber = randNum;
                                for(var n = 0; n < playersInGame.length; n++)
                                {                       
                                    console.log('posicion actual: '+playerOnTurn.posOnBoard+'dado: '+playerOnTurn.diceNumber);
                                    io.to(playersInGame[n].playerId).emit('moveToSection', playerOnTurn);
                                    io.to(playersInGame[n].playerId).emit('autoDice', randNum);     
                                    if(playersInGame[n].onGame ==false)
                                    {
                                        console.log("player "+playersInGame[n].playerId+" i outside");
                                        io.to(playersInGame[n].playerId).emit('gameStarted', playersInGame);
                                    }
                                }                            
                                    playerOnTurn.posOnBoard = playerOnTurn.posOnBoard + randNum;
                    console.log('murio al final');                   
                    clearInterval(game.intervalIdCB);
                        }
                }
                }
            });
            
            socket.on('diceRoll', (params) => {
                //var player = players.getPlayer(socket.id);        
        //     var game = games.getGame(player.hostId); //Gets the game data
            //   var playersInGame = players.getPlayers(player.hostId);
            var randNum = Math.floor(Math.random() * 6);
                console.log('dice number: '+randNum);
                //    for(var n = 0; n < playersInGame.length; n++)
                //  {
                    //    io.to(playersInGame[n].playerId).emit('diceRoll', params);//Sending players a ballot                                     
                    //}        
            });
            socket.on('player-attempt-to-win', (params) => {
                var gameFound = false; //If a game is found with pin provided by player
                var gamePos;
                var hostId;
                var playersInGame;
                var paramsPin;
                var boardNumbers = new Array(params.Items);
                var player = players.getPlayer(socket.id);
                var errorOnBoard = new Boolean(false);
                console.log('enviado desde '+ socket.id+' items lenght '+boardNumbers.lenght+player.hostId);
                var game = games.getGame(player.hostId); //Gets the game data
                playersInGame = players.getPlayers(player.hostId);
                var errorsCounter = 0;
                for(var i = 0; i < 25; i++)
                {
                    if(game.activeBallots[params.Items[i]]==0)
                    {
                        errorsCounter +=1;
                        errorOnBoard = true;   
                        console.log('la balota: '+params.Items[i]+' no ha salido');    
                    }            
                }
                if(errorsCounter<=0){
                    errorOnBoard = false;
                }
                console.log('tiene '+errorsCounter+' errores');
                if(!errorOnBoard)
                {     
                    console.log('lo logro '+game.intervalIdCB);
                    clearInterval(game.intervalIdCB);
                    console.log('No hay error');            
                    for(var i = 0; i < playersInGame.length; i++)
                    {
                        if(playersInGame[i].playerId!=socket.id)
                        {
                            io.to(playersInGame[i].playerId).emit('a-player-win', player.nameId);//Tell players someopne win                                    
                        }
                    }
                    io.to(socket.id).emit('ballots-check-Successful', 0);//Sending player win   
                }else
                {   
                    for(var i = 0; i < playersInGame.length; i++)
                    {
                        io.to(playersInGame[i].playerId).emit('a-player-checking-failed', player.nameId);//Tell players someopne fail                                    
                    }
                    //io.to(socket.id).emit('ballots-check-error', 0);//Sending player fail   
                    console.log('Si hay error');         
                }
            });
            //When the player connects from game view
            socket.on('player-join-game', (data) => {
                var player = players.getPlayer(data.id);
                if(player){
                    var game = games.getGame(player.hostId);
                    socket.join(game.pin);
                    player.playerId = socket.id;//Update player id with socket id
                    
                    var playerData = players.getPlayers(game.hostId);
                    socket.emit('playerGameData', playerData);
                }else{
                    socket.emit('noGameFound');//No player found
                }
                
            });
            
            //When a host or player leaves the site
            socket.on('disconnect', () => {
                var game = games.getGame(socket.id); //Finding game with socket.id
                //If a game hosted by that id is found, the socket disconnected is a host
                if(game){
                    //Checking to see if host was disconnected or was sent to game view
                    if(game.gameLive == false){
                        games.removeGame(socket.id);//Remove the game from games class
                        console.log('Game ended with pin:', game.pin);

                        var playersToRemove = players.getPlayers(game.hostId); //Getting all players in the game

                        //For each player in the game
                        for(var i = 0; i < playersToRemove.length; i++){
                            players.removePlayer(playersToRemove[i].playerId); //Removing each player from player class
                        }

                        io.to(game.pin).emit('hostDisconnect'); //Send player back to 'join' screen
                        socket.leave(game.pin); //Socket is leaving room
                    }
                }else{
                    //No game has been found, so it is a player socket that has disconnected
                    var player = players.getPlayer(socket.id); //Getting player with socket.id
                    //If a player has been found with that id
                    if(player){
                        var hostId = player.hostId;//Gets id of host of the game
                        var game = games.getGame(hostId);//Gets game data with hostId
                        var pin = game.pin;//Gets the pin of the game
                        
                        if(game.gameLive == false){
                            players.removePlayer(socket.id);//Removes player from players class
                            var playersInGame = players.getPlayers(hostId);//Gets remaining players in game

                            io.to(pin).emit('updatePlayerLobby', playersInGame);//Sends data to host to update screen
                            socket.leave(pin); //Player is leaving the room
                    
                        }
                    }
                }
                
            });
            
            //Sets data in player class to answer from player
            socket.on('playerAnswer', function(num){
                var player = players.getPlayer(socket.id);
                var hostId = player.hostId;
                var playerNum = players.getPlayers(hostId);
                var game = games.getGame(hostId);
                if(game.gameData.questionLive == true){//if the question is still live
                    player.gameData.answer = num;
                    game.gameData.playersAnswered += 1;
                    
                    var gameQuestion = game.gameData.question;
                    var gameid = game.gameData.gameid;
                    
                    MongoClient.connect(url, function(err, db){
                        if (err) throw err;
            
                        var dbo = db.db('kahootDB');
                        var query = { id:  parseInt(gameid)};
                        dbo.collection("kahootGames").find(query).toArray(function(err, res) {
                            if (err) throw err;
                            var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                            //Checks player answer with correct answer
                            if(num == correctAnswer){
                                player.gameData.score += 100;
                                io.to(game.pin).emit('getTime', socket.id);
                                socket.emit('answerResult', true);
                            }

                            //Checks if all players answered
                            if(game.gameData.playersAnswered == playerNum.length){
                                game.gameData.questionLive = false; //Question has been ended bc players all answered under time
                                var playerData = players.getPlayers(game.hostId);
                                io.to(game.pin).emit('questionOver', playerData, correctAnswer);//Tell everyone that question is over
                            }else{
                                //update host screen of num players answered
                                io.to(game.pin).emit('updatePlayersAnswered', {
                                    playersInGame: playerNum.length,
                                    playersAnswered: game.gameData.playersAnswered
                                });
                            }
                            
                            db.close();
                        });
                    });
                    
                    
                    
                }
            });
            
            socket.on('getScore', function(){
                var player = players.getPlayer(socket.id);
                socket.emit('newScore', player.gameData.score); 
            });
            
            socket.on('time', function(data){
                var time = data.time / 20;
                time = time * 100;
                var playerid = data.player;
                var player = players.getPlayer(playerid);
                player.gameData.score += time;
            });
            
            
            
            socket.on('timeUp', function(){
                var game = games.getGame(socket.id);
                game.gameData.questionLive = false;
                var playerData = players.getPlayers(game.hostId);
                
                var gameQuestion = game.gameData.question;
                var gameid = game.gameData.gameid;
                    
                    MongoClient.connect(url, function(err, db){
                        if (err) throw err;
            
                        var dbo = db.db('kahootDB');
                        var query = { id:  parseInt(gameid)};
                        dbo.collection("kahootGames").find(query).toArray(function(err, res) {
                            if (err) throw err;
                            var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                            io.to(game.pin).emit('questionOver', playerData, correctAnswer);
                            
                            db.close();
                        });
                    });
            });
            
            socket.on('nextQuestion', function(){
                var playerData = players.getPlayers(socket.id);
                //Reset players current answer to 0
                for(var i = 0; i < Object.keys(players.players).length; i++){
                    if(players.players[i].hostId == socket.id){
                        players.players[i].gameData.answer = 0;
                    }
                }
                
                var game = games.getGame(socket.id);
                game.gameData.playersAnswered = 0;
                game.gameData.questionLive = true;
                game.gameData.question += 1;
                var gameid = game.gameData.gameid;
                
                
                
                MongoClient.connect(url, function(err, db){
                        if (err) throw err;
            
                        var dbo = db.db('kahootDB');
                        var query = { id:  parseInt(gameid)};
                        dbo.collection("kahootGames").find(query).toArray(function(err, res) {
                            if (err) throw err;
                            
                            if(res[0].questions.length >= game.gameData.question){
                                var questionNum = game.gameData.question;
                                questionNum = questionNum - 1;
                                var question = res[0].questions[questionNum].question;
                                var answer1 = res[0].questions[questionNum].answers[0];
                                var answer2 = res[0].questions[questionNum].answers[1];
                                var answer3 = res[0].questions[questionNum].answers[2];
                                var answer4 = res[0].questions[questionNum].answers[3];
                                var correctAnswer = res[0].questions[questionNum].correct;

                                socket.emit('gameQuestions', {
                                    q1: question,
                                    a1: answer1,
                                    a2: answer2,
                                    a3: answer3,
                                    a4: answer4,
                                    correct: correctAnswer,
                                    playersInGame: playerData.length
                                });
                                db.close();
                            }else{
                                var playersInGame = players.getPlayers(game.hostId);
                                var first = {name: "", score: 0};
                                var second = {name: "", score: 0};
                                var third = {name: "", score: 0};
                                var fourth = {name: "", score: 0};
                                var fifth = {name: "", score: 0};
                                
                                for(var i = 0; i < playersInGame.length; i++){
                                    console.log(playersInGame[i].gameData.score);
                                    if(playersInGame[i].gameData.score > fifth.score){
                                        if(playersInGame[i].gameData.score > fourth.score){
                                            if(playersInGame[i].gameData.score > third.score){
                                                if(playersInGame[i].gameData.score > second.score){
                                                    if(playersInGame[i].gameData.score > first.score){
                                                        //First Place
                                                        fifth.name = fourth.name;
                                                        fifth.score = fourth.score;
                                                        
                                                        fourth.name = third.name;
                                                        fourth.score = third.score;
                                                        
                                                        third.name = second.name;
                                                        third.score = second.score;
                                                        
                                                        second.name = first.name;
                                                        second.score = first.score;
                                                        
                                                        first.name = playersInGame[i].name;
                                                        first.score = playersInGame[i].gameData.score;
                                                    }else{
                                                        //Second Place
                                                        fifth.name = fourth.name;
                                                        fifth.score = fourth.score;
                                                        
                                                        fourth.name = third.name;
                                                        fourth.score = third.score;
                                                        
                                                        third.name = second.name;
                                                        third.score = second.score;
                                                        
                                                        second.name = playersInGame[i].name;
                                                        second.score = playersInGame[i].gameData.score;
                                                    }
                                                }else{
                                                    //Third Place
                                                    fifth.name = fourth.name;
                                                    fifth.score = fourth.score;
                                                        
                                                    fourth.name = third.name;
                                                    fourth.score = third.score;
                                                    
                                                    third.name = playersInGame[i].name;
                                                    third.score = playersInGame[i].gameData.score;
                                                }
                                            }else{
                                                //Fourth Place
                                                fifth.name = fourth.name;
                                                fifth.score = fourth.score;
                                                
                                                fourth.name = playersInGame[i].name;
                                                fourth.score = playersInGame[i].gameData.score;
                                            }
                                        }else{
                                            //Fifth Place
                                            fifth.name = playersInGame[i].name;
                                            fifth.score = playersInGame[i].gameData.score;
                                        }
                                    }
                                }
                                
                                io.to(game.pin).emit('GameOver', {
                                    num1: first.name,
                                    num2: second.name,
                                    num3: third.name,
                                    num4: fourth.name,
                                    num5: fifth.name
                                });
                            }
                        });
                    });
                
                io.to(game.pin).emit('nextQuestionPlayer');
            });
            
            //When the host starts the game
            socket.on('startGame', () => {
                var game = games.getGame(socket.id);//Get the game based on socket.id
                game.gameLive = true;
                socket.emit('gameStarted', game.hostId);//Tell player and host that game has started
            });
            
            //Give user game names data
            socket.on('requestDbNames', function(){
                
                MongoClient.connect(url, function(err, db){
                    if (err) throw err;
            
                    var dbo = db.db('kahootDB');
                    dbo.collection("kahootGames").find().toArray(function(err, res) {
                        if (err) throw err;
                        socket.emit('gameNamesData', res);
                        db.close();
                    });
                });
                
                
            });
            
            
            socket.on('newQuiz', function(data){
                MongoClient.connect(url, function(err, db){
                    if (err) throw err;
                    var dbo = db.db('kahootDB');
                    dbo.collection('kahootGames').find({}).toArray(function(err, result){
                        if(err) throw err;
                        var num = Object.keys(result).length;
                        if(num == 0){
                            data.id = 1
                            num = 1
                        }else{
                            data.id = result[num -1 ].id + 1;
                        }
                        var game = data;
                        dbo.collection("kahootGames").insertOne(game, function(err, res) {
                            if (err) throw err;
                            db.close();
                        });
                        db.close();
                        socket.emit('startGameFromCreator', num);
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