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
            const number = Math.floor(Math.random() * (35 - 15)) + 15
            const request = moduleGameCount_.addGameCount(params.pin, socket.id, number)
            if (!request) {
                console.log('no se creo la partida')
            } else {
                console.log(`partida generada con el socket ${socket.id}, respuesta correcta ${number}`)
                const players = modulePlayers_.getPlayer(player.hostId)
                players.forEach(element => {
                    if(element.onGame == false) {
                        io.to(element.id).emit('create-game-count',{
                            response: number
                        })
                    }
                });
                console.log('se creo la partida')
            }
        }
    }

    joinGameCount(io) {
        return (params) => {
            params = params.players
            params.forEach(element => {
                const game = moduleGame_.getGame(element.id)
                if(game) {
                    moduleGameCount_.addGameCount(element.pin, element.id, element.number)
                }
            });
        }
    }

    timerGameCount(socket, io) {
        return ()=>{
            let time = 10;
            for (let index = time; index > 0; index--) {
                setTimeout(()  => {
                    io.emit('timer-game-count',index)  
                },1000)
            }
        }
    }
}

module.exports = {logicGameCount}