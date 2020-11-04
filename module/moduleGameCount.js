class moduleGameCount {
    constructor() {
        this.gamesCount = []
        this.resultGameCount = []
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

    addResultGameCount(gameId, playerId, response) {
        let result = {
            gameId: gameId,
            playerId: playerId,
            result: response
        }

        this.resultGameCount.push(result)

        return result
    }

    removeResultGameCount(gameId){
        var game = this.getResultGameCount(gameId);
        
        if(game){
            this.gamesCount = this.gamesCount.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getResultGameCount(gameId){
        return this.resultGameCount.filter((game) => game.gameId === gameId)
    }

    removeGame(pin){
        var game = this.getGame(pin);
        
        if(game){
            this.gamesCount = this.gamesCount.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getGame(pin){
        return this.gamesCount.filter((game) => game.pin === pin)[0]
    }

    getGames(pin){
        return this.gamesCount.filter((game) => game.pin === pin)
    }


}
const moduleGameCount_ = new moduleGameCount()
module.exports = {moduleGameCount_}