const {logicGameMemory_} = require('../logic/logicGameMemory')

class socketGameMemory {

    constructor() {}

    createGameMemory(socket, io) {
        return socket.on('create-game-memory',logicGameMemory_.createGameMemory(socket, io))
    }

    resultGameMemory(socket, io) {
        return socket.on('result-game-memory', logicGameMemory_.resultGameMemory(socket, io))
    }

    socketsGameMemory(socket, io) {
        this.createGameMemory(socket, io)
        this.resultGameMemory(socket, io)
    }
}

const socketGameMemory_ = new socketGameMemory()
module.exports = {socketGameMemory_}