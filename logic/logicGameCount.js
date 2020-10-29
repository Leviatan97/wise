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
                const players = players.getPlayer(player.hostId)
                players.forEach(element => {
                    if(element.onGame == false) {
                        io.to(element.id).emit('init-game-count',{
                            response: number
                        })
                    }
                });

                this.addPlayersGameCount(players, number, game.pin, gameId)
                
                this.timerGameCount(io)
                console.log('se creo la partida')
            }
        }
    }

    addPlayersGameCount(players, number, game, gameId) {
        players.forEach(element => {
            if(element.onGame == false) {
                moduleGameCount_.addGameCount(game.pin, gameId, element.playerId, number)
            }
        });
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
                console.log('no se creo la partida')
            } else {
                console.log(`resultado guardado con el socket ${socket.id}`)
            }
        }
    }

    positionsGameCount(players, result) {
        let position = []
        let playerResult
        players.forEach(element => {
            if(element.result >= result){
                playerResult = {
                    playerId: element.id,
                    result: element.result - result
                }
            } else {
                playerResult = {
                    playerId: element.id,
                    result:  result - element.result
                }
            }
            position.push(playerResult)
        });

        position.sort(this.ascendingOrder)

        return position
    }

    
    ascendingOrder(a, b) {
        return a.result - b.result
    }

}

const logicGameCount_ = new logicGameCount()
module.exports = {logicGameCount_}