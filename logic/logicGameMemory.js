const {moduleGameMemory_} = require('../module/moduleGameMemory')
const {players} = require('../module/modulePlayer')
const {games} = require('../module/moduleGame')

class logicGameMemory {
    constructor() {}
    
    createGameMemory(socket, io) {
        return (params) => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameId = Math.floor(Math.random() * (9000 - 1000)) + 1000
            const gameMemory = moduleGameMemory_.getGame(game.pin)
            const response = this.createArray()

            if(!gameMemory) {

                const request = moduleGameMemory_.addGameMemory(game.pin, gameId, player.playerId, response)

                if (!request) {
                    console.log('no se creo la partida')
                } else {
                    console.log(`partida generada con el socket ${socket.id}, con la respuesta ${response}`)
                    const players_ = players.getPlayers(player.hostId)
                    this.addPlayersGameCount(players_, response, game.pin, gameId)

                    for (let index = 0; index < players_.length; index++) {
                        
                        if(players_[index].onGame != false) {
                            io.to(players_[index].playerId).emit('init-game-memory',response)
                        }
                        
                    }
                    
                    
                    console.log('se creo la partida')
                    this.timerViewGameMemory(io, players_)
                }

            }
        }
    }

    timerViewGameMemory(io, players) {
        let time = 15;
            
        setInterval(() => {
            if(time >= 0) {
                for (let index = 0; index < players.length; index++) {
                    
                    if(players[index].onGame != false) {
                        io.to(players[index].playerId).emit('timer-view-game',time)
                    }
                    
                }
                if(time <= 0) {
                    this.timerGameMemory(io, players)
                }
                time--;
            }
        }, 1000);
        
    }

    timerGameMemory(io, players) {
        let time = 45;
            
        setInterval(() => {
            if(time >= 0) {
                for (let index = 0; index < players.length; index++) {
                    
                    if(players[index].onGame != false) {
                        io.to(players[index].playerId).emit('timer-game-memory',time)
                    }
                    
                }
                time--;
            }
        }, 1000);
        
    }

    resultGameMemory(socket, io) {
        return (params) => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameMemory = moduleGameMemory_.getGame(game.pin)
            const gamesMemory = moduleGameMemory_.getGames(game.pin)

            const response = moduleGameMemory_.addResultGameMemory(gameMemory.gameId, player.playerId, params.result)

            if (!response) {
                console.log('no se guardo el resultado')
            } else {
                console.log(`se guarda el resultado del socket ${socket.id}`)
                const players_ = players.getPlayers(player.hostId)
                const playersResult = moduleGameMemory_.getResultGame(gameMemory.gameId)

                if(gamesMemory.length == playersResult.length) {
                    for (let index = 0; index < players_.length; index++) {
                        io.to(players_[index].playerId).emit('position-game-memory', this.positionGameMemory(playersResult, gameMemory.response))
                    }
                    moduleGameMemory_.removeGame(game.pin)
                    moduleGameMemory_.removeResultGame(gameMemory.gameId)
                }

            }
        }
    }

    positionGameMemory(players, result) {
        const position = []
        players.forEach(element => {
            let player = element.response
            let points = 0
            for (let row = 0; row < player.length; row++) {
                
                for (let col = 0; col < player.length; col++) {
                    
                    if(resultPlayer[row][col] == result[row][col]) {
                        points += 1
                    }

                }

            }

            let resultPlayer = {
                playerId: element.playerId,
                points: points
            }

            position.push(resultPlayer)
        })
        
        position.sort(this.descendingOrder)

        return position

    }

    descendingOrder(a, b) {
        return b.points - a.points
    }

    addPlayersGameCount(players, response, game, gameId) {

        for (let index = 0; index < players.length; index++) {
            let playerAdd = moduleGameMemory_.getGame(game)
            if(players[index].onGame != false && players[index].playerId != playerAdd.playerId) {
                moduleGameMemory_.addGameMemory(game, gameId, players[index].playerId, response)
            }
            
        }
        
    }

    createArray() {

        let result = []
        let number

        for (let row = 0; row < 4; row++) {
            result[row] = []
            for (let col = 0; col < 3; col++) {
                
                result[row][col] = '0'
                
            }
            
        }

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                
                number = Math.floor(Math.random() * (13 - 1)) + 1
                
                while(this.checkArray(result, number) == false ) {
                    number = Math.floor(Math.random() * (13 - 1)) + 1
                }
                
                result[row][col] = number
            }
            
        }

        return result
    
    }

    checkArray(arr, num) {

        for (let row = 0; row < 4; row++) {
            
            for (let col = 0; col < 3; col++) {
                
                if(arr[row][col] == num) {
                    return false
                }
                
            }
            
        }

        return true
    }
}

const logicGameMemory_ = new logicGameMemory()
module.exports = {logicGameMemory_}