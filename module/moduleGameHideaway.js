class moduleGameHideaway {
    constructor() {
        this.gamesHideaway = []
        this.resultGameHideaway = []
        this.rounds = []
        this.conditionGameHideaway = []
    }

    addGameHideaway(
        pin, 
        gameId, 
        playerId,
        condition
    ) {
        let gameHideaway = {
            pin: pin,
            gameId:  gameId,
            playerId: playerId,
            condition: condition
        }
        
        this.gamesHideaway.push(gameHideaway)
        return gameHideaway
    }

    addRoundGameHideaway(
        gameId,
        operations, 
        result, 
        tower, 
        castle, 
        pit, 
        rock
    ) {

        let round = {
            gameId: gameId,
            operations: operations,
            result: result,
            tower: tower,
            castle: castle,
            pit: pit,
            rock: rock
        }
        this.rounds.push(round)
        return round
    
    }

    addConditionGameHideaway(gameId, playerId, condition) {
        let points = {
            gameId: gameId,
            playerId: playerId,
            condition: condition
        }

        this.conditionGameHideaway.push(points)
        return points
    }

    addResultGameHideaway(gameId, playerId, result) {
        let results = {
            gameId: gameId,
            playerId: playerId,
            result: result
        }

        this.resultGameHideaway.push(results)

        return results
    }

    removeResultGameHideaway(gameId){
        var game = this.getResultGameHideaway(gameId);
        
        if(game){
            this.resultGameHideaway = this.resultGameHideaway.filter((game) => game.pin !== pin);
        }
        return game;
    }

    editPlayerCondition(gameId, playerId) {
        this.gamesHideaway.forEach(element => {
            if(element.gameId == gameId && element.playerId == playerId) {
                console.log(element.condition)
                element.condition = false
            }
        });
    }

    getResultGameHideaway(gameId){
        return this.resultGameHideaway.filter((game) => game.gameId === gameId)
    }

    getRoundGameHideaway(gameId){
        return this.rounds.filter((game) => game.gameId === gameId)
    }

    removeRoundGameHideaway(gameId){
        var game = this.getResultGameHideaway(gameId);
        
        if(game){
            this.resultGameHideaway = this.resultGameHideaway.filter((game) => game.gameId !== gameId);
        }
        return game;
    }

    removeGame(pin){
        var game = this.getGame(pin);
        
        if(game){
            this.gamesHideaway = this.gamesCount.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getGame(pin){
        return this.gamesHideaway.filter((game) => game.pin === pin)[0]
    }

    getGames(pin){
        return this.gamesHideaway.filter((game) => game.pin === pin)
    }


}
const moduleGameHideaway_ = new moduleGameHideaway()
module.exports = {moduleGameHideaway_}