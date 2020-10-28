class moduleGameCount {
    constructor() {
        this.gamesCount = []
    }

    addGameCount(pin, hostId, count) {
        let gameCount = {
            pin: pin, 
            hostId: hostId, 
            count: count
        }
        
        this.gamesCount.push(gameCount)
        return gameCount
    }

    removeGame(hostId){
        var game = this.getGame(hostId);
        
        if(game){
            this.gamesCount = this.gamesCount.filter((game) => game.hostId !== hostId);
        }
        return game;
    }

    getGame(hostId){
        return this.gamesCount.filter((game) => game.hostId === hostId)[0]
    }


}

module.exports = {moduleGameCount}