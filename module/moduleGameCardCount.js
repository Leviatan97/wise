class moduleGameCardCount {
    constructor() {
        this.gamesCardCount = []
        this.resultGameCardCount = []
        this.rounds = []
        this.conditionGameCardCount = []
    }

    addGameCardCount(
        pin, 
        gameId, 
        playerId,
        condition,
        cards,
        points
    ) {
        let gameCardCount = {
            pin: pin,
            gameId:  gameId,
            playerId: playerId,
            condition: condition,
            cards: cards,
            points: points
        }
        
        this.gamesCardCount.push(gameCardCount)
        return gameCardCount
    }

    addRoundGameCardCount(
        gameId,
        playerId,
        cards
    ) {

        let round = {
            gameId: gameId,
            playerId,
            cards
        }

        this.rounds.push(round)
        return round
    
    }

    addResultGameCard(gameId, playerId, result) {
        let results = {
            gameId: gameId,
            playerId: playerId,
            result: result
        }

        this.resultGameCardCount.push(results)

        return results
    }

    removeResultGameCardCount(gameId){
        var game = this.getResultGameCardCount(gameId);
        
        if(game){
            this.resultGameCardCount = this.resultGameCardCount.filter((game) => game.gameId !== gameId);
        }
        return game;
    }

    editPlayerCondition(gameId, playerId) {
        this.gamesCardCount.forEach(element => {
            if(element.gameId == gameId && element.playerId == playerId) {
                element.condition = false
            }
        });
    }

    editPlayerPoint(gameId) {
        this.gamesCardCount.forEach(element => {
            if(element.gameId == gameId && element.condition == true) {
                element.points += 1
            }
        });
    }

    getConditionGameCardCount(gameId, playerId){
        return this.conditionGameCardCount.filter((game) => game.gameId === gameId && game.playerId === playerId)
    }

    getResultGameCardCount(gameId){
        return this.resultGameCardCount.filter((game) => game.gameId === gameId)
    }

    getRoundGameCardCount(gameId){
        return this.rounds.filter((game) => game.gameId === gameId)
    }

    removeRoundGameCardCount(gameId){
        var game = this.getResultGameCardCount(gameId);
        
        if(game){
            this.resultGameCardCount = this.resultGameCardCount.filter((game) => game.gameId !== gameId);
        }
        return game;
    }

    removeGame(pin){
        var game = this.getGame(pin);
        
        if(game){
            this.gamesCardCount = this.gamesCardCount.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getGame(pin){
        return this.gamesCardCount.filter((game) => game.pin === pin)[0]
    }

    getGames(pin){
        return this.gamesCardCount.filter((game) => game.pin === pin)
    }
}
const moduleGameCardCount_ = new moduleGameCardCount()
module.exports = {moduleGameCardCount_};