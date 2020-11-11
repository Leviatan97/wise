class moduleGameHideaway {
    constructor() {
        this.gamesHideaway = []
        this.resultGameHideaway = []
    }

    addGameHideaway(
        pin, 
        gameId, 
        playerId, 
        operations, 
        result, 
        tower, 
        castle, 
        pit, 
        rock,
        turn
    ) {
        let gameHideaway = {
            pin: pin,
            gameId:  gameId,
            playerId: playerId,
            operations: operations,
            result: result,
            tower: tower,
            castle: castle,
            pit: pit,
            rock: rock,
            turn: turn
        }
        
        this.gamesHideaway.push(gameHideaway)
        return gameHideaway
    }

    addResultGameHideaway(gameId, playerId, response) {
        let result = {
            gameId: gameId,
            playerId: playerId,
            result: response
        }

        this.resultGameHideaway.push(result)

        return result
    }

    removeResultGameHideaway(gameId){
        var game = this.getResultGameHideaway(gameId);
        
        if(game){
            this.resultGameHideaway = this.resultGameHideaway.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getResultGameHideaway(gameId){
        return this.resultGameHideaway.filter((game) => game.gameId === gameId)
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