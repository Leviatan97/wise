const {moduleGame} = require('../module/moduleGame')
const {moduleGameCount} = require('../module/moduleGameCount')
const moduleGame_ = new moduleGame()
const moduleGameCount_ = new moduleGameCount()

class logicGameCount {

    constructor() {}

    createGameCount(socket, io) {
        return (params) => {
            const number = Math.floor(Math.random() * (35 - 15)) + 15
            const request = moduleGameCount_.addGameCount(params.pin, socket.id, number)
            if (!request) {
                console.log('no se creo la partida')
            } else {
                console.log(`partida generada con el socket ${socket.id}, respuesta correcta ${number}`)
                io.to(socket.id).emit('create-game-count',{
                    response: number
                })
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
            io.emit('join-game-count',{
                message: 'los jugadores ingresaron a la partida'
            })
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