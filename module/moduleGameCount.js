class moduleGameCount {
    constructor() {
        this.gamesCount = []
    }

    addGameCount(pin, gameId, playerId, number) {
        let gameCount = {
            pin: pin,
            gameId:  gameId,
            playerId: playerId,
            number: number
        }
        
        this.gamesCount.push(gameCount)
        return gameCount
    }

    removeGame(gameId){
        var game = this.getGame(gameId);
        
        if(game){
            this.gamesCount = this.gamesCount.filter((game) => game.gameId !== gameId);
        }
        return game;
    }

    getGame(gameId){
        return this.gamesCount.filter((game) => game.gameId === gameId)[0]
    }


}

module.exports = {moduleGameCount}