const { moduleGameCard_ } = require("../module/moduleGameCard")
const { players } = require("../module/modulePlayer")

class logicGameCard {
    constructor() {}

    createGameCard(socket, io) {
        return () => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameId = Math.floor(Math.random() * (9000 - 1000)) + 1000
            const gameCard = moduleGameCard_.getGame(game.pin)
            let cards = this.generateCards()

            if(!gameCard) {
                const request = moduleGameCard_.addGameCard(
                    game.pin, 
                    gameId, 
                    player.playerId, 
                    cards
                )

                if(!request) {
                    console.log('no se creo la partida')
                } else {
                    console.log(`partida generada por el socket ${socket.id} con las siguientes cartas ${cards}`)
                    let players_ = players.getPlayers(player.hostId)
                    for (let index = 0; index < players_.length; index++) {
                        
                        if(players_[index].onGame != false) {
                            let playerAdd = moduleGameHideaway_.getGame(game.pin)
                            if (players[index].playerId != playerAdd.playerId) {
                                let cardsPlayer = this.generateCards()
                                moduleGameCard_.addGameCard(game.pin, gameId, players[index].playerId, cardsPlayer)
                                io.to(players_[index].playerId).emit('init-game-card', cardsPlayer)
                            }else {
                                io.to(players_[index].playerId).emit('init-game-card', cards)
                            }
                        }
                        
                    }
                }
            }
        }
    }

    generateCards() {

        let cards = []
        for (let index = 0; index < 6; index++) {
            cards[index] = Math.floor(Math.random() * (6 - 1)) + 1
        }

        return cards
    }
}

const logicGameCard_ = new logicGameCard()
module.exports = {logicGameCard_}