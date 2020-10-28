const {logicGameCount} = require('../logic/logicGameCount')
const logicGameCount_ = new logicGameCount()

class socketGameCount {
    constructor() { }

    createGameCount(socket, io) {
        return socket.on('create-game-count', logicGameCount_.createGameCount(socket, io))
    }

    socketsGameCount(socket, io) {
        this.createGameCount(socket, io)
    }
    
}

module.exports = {socketGameCount}