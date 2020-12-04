class moduleGameCard {
    constructor() {
        this.gamesCard = []
        this.resultGameCard = []
        this.pointsGameCard = []
    }

    addGameCard(pin, gameId, playerId, cards, round) {
        let gameCard = {
            pin: pin,
            gameId:  gameId,
            playerId: playerId,
            cards: cards,
            round: round
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

    addPointGameCard(gameId, playerId, points) {
        let point = {
            gameId: gameId,
            playerId: playerId,
            points: points
        }

        this.pointsGameCard.push(point)
        return point
    }

    getResultGameCard(gameId){
        return this.resultGameCard.filter((game) => game.gameId === gameId)
    }

    getPlayerResultGameCard(gameId, playerId){
        return this.resultGameCard.filter((game) => game.gameId === gameId)
    }

    editPointsGameCard(gameId, playerId) {
        this.pointsGameCard.forEach(element => {
            if(element.gameId == gameId && element.playerId == playerId) {
                element.points += 1 
            }
        });
    }

    addRoundGameCard(gameId, playerId) {
        this.gamesCard.forEach(element => {
            if(element.gameId == gameId && element.playerId == playerId) {
                element.round += 1 
            }
        });
    }

    getPointGameCard(gameId, playerId){
        return this.pointsGameCard.filter((game) => game.gameId === gameId && game.playerId === playerId)[0]
    }

    getPointsGameCard(gameId){
        return this.pointsGameCard.filter((game) => game.gameId === gameId)
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