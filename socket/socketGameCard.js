const { logicGameCard_ } = require("../logic/logicGameCard");

class socketGameCard {

    constructor() {}

    createGameCard(socket, io) {
        return socket.on('create-game-card', logicGameCard_.createGameCard(socket, io))
    }

    socketsGameCard(socket, io) {
        this.createGameCard(socket, io)
    }
}

const socketGameCard_ = new socketGameCard()
module.exports = {socketGameCard_}