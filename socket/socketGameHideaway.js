const { logicGameHideaway_ } = require("../logic/logicGameHideaway")

class socketGameHideaway {
    constructor() {}
    
    createGameHideaway(socket, io) {
        return socket.on('create-game-hideaway', logicGameHideaway_.createGameHideaway(socket, io))
    }

    socketsGameHideaway(socket, io) {
        this.createGameHideaway(socket, io)
    }
}

const socketGameHideaway_ = new socketGameHideaway()
module.exports = {socketGameHideaway_}