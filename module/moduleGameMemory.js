class moduleGameMemory {
    constructor() {
        this.gamesMemory = []
        this.resultsGamesMemory = []
    }

    addGameMemory(pin, gameId, playerId, response) {
        let gameMemory = {
            pin: pin,
            gameId: gameId,
            playerId: playerId,
            response: response
        }

        this.gamesMemory.push(gameMemory)

        return gameMemory
    }

    addResultGameMemory(gameId, playerId, response) {
        let resultGameMemory = {
            gameId: gameId,
            playerId: playerId,
            response: response
        }

        this.resultsGameMemory.push(resultGameMemory)

        return resultGameMemory
    }

    removeResultGame(gameId){
        var game = this.getGame(gameId);
        
        if(game){
            this.resultsGamesMemory = this.gamesCount.filter((game) => game.gameId !== gameId);
        }
        return game;
    }

    getResultGame(gameId){
        return this.resultsGamesMemory.filter((game) => game.gameId === gameId)[0]
    }

    removeGame(pin){
        var game = this.getGame(pin);
        
        if(game){
            this.gamesMemory = this.gamesCount.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getGame(pin){
        return this.gamesMemory.filter((game) => game.pin === pin)[0]
    }
}

const moduleGameMemory_ = new moduleGameMemory()
module.exports = {moduleGameMemory_}