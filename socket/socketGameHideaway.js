const { logicGameHideaway_ } = require("../logic/logicGameHideaway")

class socketGameHideaway {
    constructor() {}
    
    createGameHideaway(socket, io) {
        return socket.on('create-game-hideaway', logicGameHideaway_.createGameHideaway(socket, io))
    }

    resultGameHideaway(socket, io) {
        return socket.on('result-game-hideaway', logicGameHideaway_.resultGameHideaway(socket, io))
    }

    newRoundGameHideaway(socket, io) {
        return socket.on('new-round-game-hideaway', logicGameHideaway_.newRoundGameHideaway(socket, io))
    }

    socketsGameHideaway(socket, io) {
        this.createGameHideaway(socket, io)
        this.resultGameHideaway(socket, io)
        this.newRoundGameHideaway(socket, io)
    }
}

const socketGameHideaway_ = new socketGameHideaway()
module.exports = {socketGameHideaway_}