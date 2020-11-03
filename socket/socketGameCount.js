const {logicGameCount_} = require('../logic/logicGameCount')


class socketGameCount {
    constructor() { }

    createGameCount(socket, io) {
        return socket.on('create-game-count', logicGameCount_.createGameCount(socket, io))
    }

    resultGameCount(socket, io) {
        return socket.on('result-game-Count', logicGameCount_.resultGameCount(socket, io))
    }

    socketsGameCount(socket, io) {
        this.createGameCount(socket, io)
        this.resultGameCount(socket, io)
    }
    
}

const socketGameCount_ = new socketGameCount()
module.exports = {socketGameCount_}