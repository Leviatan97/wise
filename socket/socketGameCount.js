const {logicGameCount} = require('../logic/logicGameCount')
const logicGameCount_ = logicGameCount()

class socketGameCount {
    constructor() { }

    createGameCount(socket, io) {
        return socket.on('create-game-count', logicGameCount_.createGameCount(socket, io))
    }

    joinGameCount(socket, io) {
        return socket.on('join-game-count', logicGameCount_.joinGameCount(socket, io))
    }

    timerGameCount(socket, io) {
        return socket.on('timer-game-count', logicGameCount_.timerGameCount(socket, io))
    }

    socketsGameCount(socket, io) {
        this.createGameCount(socket, io)
        this.joinGameCount(socket, io)
        this.timerGameCount(socket, io)
    }
    
}

module.exports = {socketGameCount}