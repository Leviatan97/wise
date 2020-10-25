const {logicPlayer} = require('../logic/logicPlayer')
const logicPlayer_ = new logicPlayer()

class socketPlayer {

    constructor(){}

    hostJoin(socket) {
        return socket.on('host-join', logicPlayer_.hostJoin);
    }

    playerHostJoin(socket) {
        return socket.on('player-host-join',logicPlayer_.playerHostJoin(socket))
    }

    hostJoinGame(socket, io) {
        return socket.on('host-join-game',logicPlayer_.hostJoinGame(socket, io))
    }
}

module.exports = {socketPlayer}