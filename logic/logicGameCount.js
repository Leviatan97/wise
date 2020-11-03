const {players} = require('../module/modulePlayer');
const {games} = require('../module/moduleGame')
const {moduleGameCount_} = require('../module/moduleGameCount')

class logicGameCount {

    constructor() {}

    createGameCount(socket, io) {
        return (params) => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const number = Math.floor(Math.random() * (35 - 15)) + 15
            const gameId = Math.floor(Math.random() * (9000 - 1000)) + 1000
            const request = moduleGameCount_.addGameCount(game.pin, gameId, player.playerId, number)
            if (!request) {
                console.log('no se creo la partida')
            } else {
                console.log(`partida generada con el socket ${socket.id}, respuesta correcta ${number}`)
                const players_ = players.getPlayers(player.hostId)
                this.addPlayersGameCount(players_, number, game.pin, gameId)
                for (let index = 0; index < players_.length; index++) {
                    
                    if(players_[index].onGame != false) {
                        io.to(players_[index].playerId).emit('init-game-count',{
                            response: number
                        })
                    }
                    
                }
                
                console.log('se creo la partida')
                this.timerGameCount(io)
                
            }
        }
    }

    addPlayersGameCount(players, number, game, gameId) {
        
        for (let index = 0; index < players.length; index++) {
            let playerAdd = moduleGameCount_.getGame(game)
            if(players[index].onGame != false && players[index].playerId != playerAdd.playerId) {
                moduleGameCount_.addGameCount(game, gameId, players[index].playerId, number)
            }
        }
        
    }

    timerGameCount(io) {
        return ()=>{
            let time = 10;
            for (let index = time; index >= 0; index--) {
                setTimeout(()  => {
                    if(index == 0) {
                        io.emit('game-over-count',index) 
                    }
                },1000)
            }
        }
    }

    resultGameCount(socket, io) {
        return (params)=> {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameCount = moduleGameCount_.getGame(game.pin)
            
            const response = moduleGameCount_.addResultGameCount(gameCount.gameId, gameCount.playerId, params.result)

            if(!response) {
                console.log('no se guardo el resultado')
            } else {
                console.log(`resultado guardado con el socket ${socket.id}`)
                const players = players.getPlayer(player.hostId) 
                const playersResult = moduleGameCount_.getResultGameCount(gameCount.gameId)

                players.forEach(element => {
                    io.to(element.playerId).emit('position-game-count', this.positionsGameCount(playersResult, gameCount.result))
                });
                
            }
        }
    }

    positionsGameCount(players, result) {
        let position = []
        let playerResult
        
        for (let index = 0; index < players.length; index++) {
            
            if(players.result >= result){
                playerResult = {
                    playerId: players.playerId,
                    result: players.result - result
                }
            } else {
                playerResult = {
                    playerId: players.playerId,
                    result:  result - players.result
                }
            }
            position.push(playerResult)
            
        }

        position.sort(this.ascendingOrder)

        return position
    }

    
    ascendingOrder(a, b) {
        return a.result - b.result
    }

}

const logicGameCount_ = new logicGameCount()
module.exports = {logicGameCount_}