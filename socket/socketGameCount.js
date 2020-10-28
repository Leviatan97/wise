const {logicGameCount} = require('../logic/logicGameCount')
const logicGameCount_ = new logicGameCount()

class socketGameCount {
    constructor() { }

    createGameCount(socket, io) {
        return socket.on('create-game-count', logicGameCount_.createGameCount(socket, io))
    }

    joinGameCount(socket, io) {
        return socket.on('join-game-count', logicGameCount_.joinGameCount(socket, io))
    }

    socketsGameCount(socket, io) {
        this.createGameCount(socket, io)
        this.joinGameCount(socket, io)
    }
    
}

module.exports = {socketGameCount}