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
}

const moduleGameMemory_ = new moduleGameMemory()
module.exports = {moduleGameMemory_}