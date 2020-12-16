const { logicGameCardCount_ } = require("../logic/logicGameCardCount")


class socketGameCardCount {

    constructor() {}

    createGameCardCount(socket, io) {
        return socket.on('create-game-card', logicGameCardCount_.createGameCardCount(socket, io))
    }

    resultGameCardCount(socket, io) {
        return socket.on('result-game-card', logicGameCardCount_.resultGameCardCount(socket, io))
    }

    socketsGameCardCount(socket, io) {
        this.createGameCardCount(socket, io)
        this.resultGameCardCount(socket, io)
    }
}

const socketGameCardCount_ = new socketGameCardCount()
module.exports = {socketGameCardCount_}