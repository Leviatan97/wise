const {logicPlayer} = require('../logic/logicPlayer')
const logicPlayer_ = new logicPlayer()

class socketPlayer {

    constructor(){}

    hostJoin(socket) {
        return socket.on('host-join', logicPlayer_.hostJoin);
    }

    playerHostJoin(socket) {
        return socket.on('player-host-join',logicPlayer_.playerHostJoin)
    }

    hostJoinGame(socket) {
        console.log(socket.id)
        logicPlayer_.setSocketId(socket.id)
        return socket.on('host-join-game',logicPlayer_.hostJoinGame)
    }
}

module.exports = {socketPlayer}