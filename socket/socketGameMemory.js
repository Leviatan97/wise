const {logicGameMemory_} = require('../logic/logicGameMemory')

class socketGameMemory {

    constructor() {}

    createGameMemory(socket, io) {
        return socket.on('create-game-memory',logicGameMemory_.createGameMemory(socket, io))
    }

    socketsGameMemory(socket, io) {
        this.createGameMemory(socket, io)
    }
}

const socketGameMemory_ = new socketGameMemory()
module.exports = {socketGameMemory_}