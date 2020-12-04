class modulePlayers {
    constructor () {
        this.players = [];
        this.playersPos = [];
    }
    addPlayer(hostId, playerId, nameId, profilePic, pos){
        var diceNumber = 0;
        var onGame = new Boolean(false);
        var posOnBoard =0;
        var player = {hostId, playerId, nameId, profilePic, onGame, posOnBoard,diceNumber, pos};
        this.players.push(player);
        return player;
    }

    addPlayerPos(hostId, playerId, pos) {
        let posPlayer = {
            hostId: hostId,
            playerId: playerId,
            pos: pos
        }

        this.playersPos.push(posPlayer)

        return posPlayer
    }

    getPlayersPos(hostId){
        return this.playersPos.filter((player) => player.hostId === hostId);
    }

    removePlayer(playerId){
        var player = this.getPlayer(playerId);
        
        if(player){
            this.players = this.players.filter((player) => player.playerId !== playerId);
        }
        return player;
    }
    getPlayer(playerId){
        return this.players.filter((player) => player.playerId === playerId)[0]
    }
    getPlayerByTurn(playerTurn,hostId){
        return this.players.filter((player) => player.pos === playerTurn&&player.hostId === hostId)[0]
    }
    updatePlayerId(newPlayerId, _playerId){
        var playerToChange = this.players.filter((player) => player.playerId === _playerId)[0];
        playerToChange.playerId = newPlayerId; 
    }
    getPlayers(hostId){
        return this.players.filter((player) => player.hostId === hostId);
    }
}
const players = new modulePlayers()
module.exports = {players};