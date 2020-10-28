const {logicPlayer} = require('../logic/logicPlayer');
const socketGameCount = require('./socketGameCount');
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
        socket.on('player-send-emoji', logicPlayer_.playerSendEmoji(socket, io))
    }

    playerAttemptToWin(socket, io) {
        return socket.on('player-attempt-to-win', logicPlayer_.playerAttemptToWin(socket, io))
    }

    playerJoinGame(socket) {
        return socket.on('player-join-game', logicPlayer_.playerJoinGame(socket))
    }

    hostStartBingoGame(socket, io) {
        return socket.on('host-start-bingo-game', logicPlayer_.hostStartBingoGame(io))
    }

    newTurn(socket, io) {
        return socket.on('newTurn', logicPlayer_.newTurn(io))
    }

    minigameDice(socket) {
        return socket.on('minigameDice', logicPlayer_.minigameDice(socket, io))
    }

    clearInterval(socket, io) {
        return socket.on('clearInterval', logicPlayer_.clearInterval(socket, io))
    }

    clear(socket) {
        return socket.on('clear', logicPlayer_.clear(socket))
    }

    endMiniGame(socket) {
        return socket.on('endminigame', logicPlayer_.endMiniGame(socket))
    }

    socketsPlayer(socket, io) {
        this.hostJoin(socket)
        this.playerHostJoin(socket)
        this.hostJoinGame(socket, io)
        this.updatePlayerSocketId(socket, io)
        this.playerJoin(socket, io)
        this.playerEnterGame(socket)
        this.playerSendEmoji(socket, io)
        this.playerAttemptToWin(socket, io)
        this.playerJoinGame(socket)
        this.newTurn(socket, io)
        this.minigameDice(socket, io)
        this.clearInterval(socket, io)
        this.clear(socket)
        this.endMiniGame(socket)
    }
}

module.exports = {socketPlayer}