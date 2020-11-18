class moduleGameCard {
    constructor() {
        this.gamesCard = []
        this.resultGameCard = []
    }

    addGameCard(pin, gameId, playerId, cards) {
        let gameCard = {
            pin: pin,
            gameId:  gameId,
            playerId: playerId,
            cards: cards
        }
        
        this.gamesCard.push(gameCard)
        return gameCard
    }

    addResultGameCard(gameId, playerId, response) {
        let result = {
            gameId: gameId,
            playerId: playerId,
            result: response
        }

        this.resultGameCard.push(result)

        return result
    }

    removeResultGameCard(gameId){
        var game = this.getResultGameCount(gameId);
        
        if(game){
            this.gamesCard = this.gamesCard.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getResultGameCard(gameId){
        return this.resultGameCard.filter((game) => game.gameId === gameId)
    }

    removeGame(pin){
        var game = this.getGame(pin);
        
        if(game){
            this.gamesCard = this.gamesCount.filter((game) => game.pin !== pin);
        }
        return game;
    }

    getGame(pin){
        return this.gamesCard.filter((game) => game.pin === pin)[0]
    }

    getGames(pin){
        return this.gamesCard.filter((game) => game.pin === pin)
    }


}
const moduleGameCard_ = new moduleGameCard()
module.exports = {moduleGameCard_}