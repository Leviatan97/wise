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

    updatePlayerSocketId(socket, io) {
        return socket.on('updatePlayerSocketId',logicPlayer_.updatePlayerSocketId(socket, io))
    }

    playerJoin(socket, io) {
        return socket.on('player-join', logicPlayer_.playerJoin(io))
    }

    playerEnterGame(socket) {
        return socket.on('playerEnterGame', logicPlayer_.playerEnterGame(socket))
    }

    playerSendEmoji(socket, io) {
        socket.on('player-send-emoji', logicPlayer_.playerSendEmoji(io))
    }

    socketsPlayer(socket, io) {
        this.hostJoin(socket)
        this.playerHostJoin(socket)
        this.hostJoinGame(socket, io)
        this.updatePlayerSocketId(socket, io)
        this.playerJoin(socket, io)
        this.playerEnterGame(socket)
        this.playerSendEmoji(socket, io)
    }
}

module.exports = {socketPlayer}