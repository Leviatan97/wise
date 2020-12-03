const { logicGameCard_ } = require("../logic/logicGameCard");

class socketGameCard {

    constructor() {}

    createGameCard(socket, io) {
        return socket.on('create-game-card', logicGameCard_.createGameCard(socket, io))
    }

    resultGameCard(socket, io) {
        return socket.on('result-game-card', logicGameCard_.resultGameCard(socket, io))
    }

    socketsGameCard(socket, io) {
        this.createGameCard(socket, io)
        this.resultGameCard(socket, io)
    }
}

const socketGameCard_ = new socketGameCard()
module.exports = {socketGameCard_}