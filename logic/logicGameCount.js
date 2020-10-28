const {moduleGame} = require('../module/moduleGame')
const {moduleGameCount} = require('../module/moduleGameCount')
const {modulePlayers} = require('../module/modulePlayer')
const moduleGame_ = new moduleGame()
const moduleGameCount_ = new moduleGameCount()
const modulePlayers_ = new modulePlayers()

class logicGameCount {

    constructor() {}

    createGameCount(socket, io) {
        return (params) => {
            const player = modulePlayers_.getPlayer(socket.id)
            const game = moduleGameCount_.getGame(player.hostId)
            const number = Math.floor(Math.random() * (35 - 15)) + 15
            const gameId = Math.floor(Math.random() * (9000 - 1000)) + 1000
            const request = moduleGameCount_.addGameCount(game.pin, gameId, player.playerId, number)
            if (!request) {
                console.log('no se creo la partida')
            } else {
                console.log(`partida generada con el socket ${socket.id}, respuesta correcta ${number}`)
                const players = modulePlayers_.getPlayer(player.hostId)
                players.forEach(element => {
                    if(element.onGame == false) {
                        io.to(element.id).emit('init-game-count',{
                            response: number
                        })
                    }
                });
                this.addPlayersGameCount(players, number, game, gameId)
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
}

module.exports = {logicGameCount}