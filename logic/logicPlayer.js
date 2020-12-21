const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/";
const {players} = require('../module/modulePlayer');
const {games} = require('../module/moduleGame')


class logicPlayer {
    
    constructor() {}

    hostJoin(data) {
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
    }

    playerHostJoin(socket) {

        return (params)=> {
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
        }
    }

    hostJoinGame(socket, io) {

        return (data)=>{
            var oldHostId = data.id;  
            var gamepin2 = Math.floor(Math.random()*90000) + 10000; //new pin for game
            console.log(data+" id encontrado, id generado... "+gamepin2+" socket id: "+socket.id);
            games.addGame(gamepin2,socket.id,76);
            io.to(socket.id).emit('hola',{n: gamepin2 });
            io.to(socket.id).emit('conn');
            console.log("enviado");
        }
        
    }

    updatePlayerSocketId(socket, io) {
        return (params) => {
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
        }
    }
    playerJoin(socket, io) {
        return (params) => {
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
        }
    }

    playerEnterGame(socket) {
        return (params) => {
            var player = players.getPlayer(socket.id);
            if(player)
            {
                console.log("callback from: "+player.nameId)
                player.onGame = true;
            }
        }
    }

    playerSendEmoji(socket, io) {
        return (params) => {
            var player = players.getPlayer(socket.id);        
            var game = games.getGame(player.hostId); //Gets the game data
            var playersInGame = players.getPlayers(player.hostId);
                for(var n = 0; n < playersInGame.length; n++)
                {
                    io.to(playersInGame[n].playerId).emit('emojiReceived', params);//Sending players a ballot                                     
                }
        }
    }

    playerAttemptToWin(socket, io) {
        return (params) => {
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
        }
    }

    playerJoinGame(socket) {
        return (data) => {
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
        }
    }

    hostStartBingoGame(socket, io) {
        return (params) => {
            var gameFound = false; //If a game is found with pin provided by player
            var gamePos;
            var hostId;
            var playersInGame;
            var paramsPin;
            var lvl;
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
                    console.log('activating board in host start bingo game'+params.currLevel);
                    io.to(params.pin).emit('activate-board', params.currLevel);//Sending players data to display
                    //io.to(hostId).emit('updateLobby', playersInGame);//Sending host player data to display
                    gameFound = true; //Game has been found
                }
                
            }
        }
    }

    newTurn(socket, io) {
        return (params) => {
            var player = players.getPlayer(socket.id);        
            var game = games.getGame(player.hostId); //Gets the game data    
            console.log("mirar aqui triple hp "+game.onTurn);
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
                            console.log('activating board in new turn '+params.currLevel);
                            io.to(playersInGame[n].playerId).emit('activate-board', params.currLevel);
                            io.to(params.pin).emit('activate-board', params.currLevel);//Sending players data to display
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
                    console.log("Iteraciones!!!!" + iterations);
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
                                    console.log('activating board in new turn'+params.currLevel);
                                    io.to(playersInGame[n].playerId).emit('activate-board', params.currLevel);
                                    io.to(params.pin).emit('activate-board', params.currLevel);//Sending players data to display
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
                    console.log('activating board '+params.currLevel);
                    io.to(params.pin).emit('activate-board on an else', params.currLevel);//Sending players data to display
                                    }
                                }                            
                                    playerOnTurn.posOnBoard = playerOnTurn.posOnBoard + randNum;
                        console.log('murio al final');                   
                        clearInterval(game.intervalIdCB);
                    }
                }
            }
        }
    }  
     claimspecialpoint(socket, io) {
        return (params) => {
           
                 console.log('lkjsadkjhskjshkjshiouwykjnhwikujhwqkjhewkjhwq');
            var playerOnTurn; 
            var player = players.getPlayer(socket.id);        
            var game = games.getGame(player.hostId); //Gets the game data   
            var playersInGame = players.getPlayers(player.hostId);  
            playerOnTurn = players.getPlayerByTurn(game.currTurn,player.hostId);    
       
            playerOnTurn.diceNumber = params.profilePic;
               for(var n = 0; n < playersInGame.length; n++)
               {                       
                 console.log('posicion actual: '+playerOnTurn.posOnBoard+'dado: '+playerOnTurn.diceNumber);
                 io.to(playersInGame[n].playerId).emit('moveToSpecialSection', playerOnTurn);
                io.to(playersInGame[n].playerId).emit('autoDice', randNum);     
                  if(playersInGame[n].onGame ==false)
                  {
                     console.log("player "+playersInGame[n].playerId+" i outside");
                     io.to(playersInGame[n].playerId).emit('gameStarted', playersInGame);
                  }
               }                            
                             playerOnTurn.posOnBoard =  params.profilePic;
        }
    }
   
    minigameDice(socket, io) {
        return (params) => {
            var player = players.getPlayer(socket.id);
            var game = games.getGame(player.hostId); //Gets the game data
            var playersInGame = players.getPlayers(player.hostId);
             for(var n = 0; n < playersInGame.length; n++){
                    io.to(playersInGame[n].playerId).emit('minigamedice', 1);//Sending players old and new sockets                                     
             }
        }
    }
    
    
    test12(socket, io) {
        return (params) => {
            
                 console.log('lkjsadkjhskjshkjshiouwykjnhwikujhwqkjhewkjhwq');
        }
    }
    

    clearInterval(socket, io) {
        return (params) => {
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
                    console.log('activating board '+params.currLevel);
                    io.to(params.pin).emit('activate-board on clearing interval', params.currLevel);//Sending players data to display
                               }
                        }                            
                            playerOnTurn.posOnBoard = playerOnTurn.posOnBoard + randNum;
                    console.log('murio al final');
                    game.currTurn++;
                    if(game.currTurn>=playersInGame.length){
                        game.currTurn = 0;
                    }
        }
    }

    clear(socket, io) {
        return (params) => {
            var player = players.getPlayer(socket.id);        
            var game = games.getGame(player.hostId); //Gets the game data        
            clearInterval(game.intervalIdCB);
        }
    }

    playerReachedEndOfTheGame(socket, io) {
        return () => {
            let player = players.getPlayer(socket.id)
            let game = games.getGame(player.hostId);

            console.log("llego a player Reached End Of The Game")
            if(!game) {
                console.log("ya se elimino el juego")
            }else {

                // let gameRemove = games.removeGame(player.hostId)
                let players_ = players.getPlayers(player.hostId)

                for (let index = 0; index < players_.length; index++) {
                    
                    io.to(players_[index].playerId).emit('game-is-over', 1)

                }
               
            }
        }
    }

    finalPos(socket, io) {
        return (params) => {
            let player = players.getPlayer(socket.id)
            let positionPlayer = players.addPlayerPos(player.hostId, player.playerId, params)
            let posPlayers = players.getPlayersPos(player.hostId)
            console.log("llego a final pos")
            if(!positionPlayer) {
                console.log("no se guardo la posicion en el tablero")
            } else {
                let players_ = players.getPlayers(player.hostId)
                if(posPlayers.length == players_.length) {
                    console.log(this.positionsGame(posPlayers))
                    for (let index = 0; index < players_.length; index++) {
                        
                        io.to(players_[index].playerId).emit('final-results', this.positionsGame(posPlayers))
                        
                    }

                }
            }
            
        }
    }

    positionsGame(players) {
        let position = []
        let playerPos
        
        for (let index = 0; index < players.length; index++) {
            
            playerPos = {
                playerId: players[index].playerId,
                pos: players[index].pos
            }

            position.push(playerPos)
            
        }

        position.sort(this.ascendingOrder)

        return this.positionNumberGame(position)
    }

    positionNumberGame(players) {
        let positions = []
        let position
        
        for (let index = 0; index < players.length; index++) {
            if (index > 0) {
                if(players[index-1].pos == players[index].pos) {
                    position = {
                        playerId: players[index].playerId,
                        result: players[index].pos,
                        position: index
                    }
                } else {
                    position = {
                        playerId: players[index].playerId,
                        result: players[index].pos,
                        position: index + 1
                    }
                }
            }else {
                position = {
                    playerId: players[index].playerId,
                    result: players[index].pos,
                    position: 1
                }
            }
            positions.push(position)
        }

        return positions
    }

    
    ascendingOrder(a, b) {
        return b.pos - a.pos
    }

    endMiniGame(socket, io) {
        return (params) => {
            console.log("ending minigame");
            var player = players.getPlayer(socket.id);        
            var game = games.getGame(player.hostId); //Gets the game data        
            game.onTurn = 1;
            clearInterval(game.intervalIdCB);
        }
    }

    removeGame(socket, io) {
        return () => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId);
            if(game) {
                const gameRemove = games.removeGame(player.hostId)
                io.to(player.playerId).emit('cancel-game', true)
            }

        }
    }

    claimSpecialPoint(socket, io) {
        return (params) => {
            console.log("Entro al socket claim-special-point")
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            let playerOnTurn = players.getPlayerByTurn(game.currTurn,player.hostId);
            let playersInGame = players.getPlayers(player.hostId);

            playerOnTurn.diceNumber = params.profilePic;
            playerOnTurn.posOnBoard = playerOnTurn.posOnBoard - params.profilePic;
            
            for(var n = 0; n < playersInGame.length; n++)
            {                       
                io.to(playersInGame[n].playerId).emit('moveToSection', playerOnTurn);
            }
        }
    }

}

const logicPlayer_ = new logicPlayer()
module.exports = {logicPlayer_}
