const {logicPlayer} = require('../logic/logicPlayer')
const logicPlayer_ = new logicPlayer()

class socketPlayer {

    constructor(){}

    hostJoin(socket) {
        return socket.on('host-join', logicPlayer_.hostJoin);
    }

}

module.exports = {socketPlayer}