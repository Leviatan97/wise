const {moduleGameCardCount_} = require("../module/moduleGameCardCount")

class logicGameCardCount {
    constructor() {}

    createGameCardCount(socket, io) {
        return () => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameId = Math.floor(Math.random() * (9000 - 1000)) + 1000
            const gameCard = moduleGameCardCount_.getGame(game.pin)
            let cards = this.generateCards()

            if(!gameCard) {
                const request = moduleGameCardCount_.addGameCardCount(
                    game.pin, 
                    gameId, 
                    player.playerId, 
                    cards,
                    true,
                    0
                )

                if(!request) {
                    console.log('no se creo la partida')
                } else {
                    console.log(`partida generada por el socket ${socket.id} con las siguientes cartas ${cards}`)
                    let players_ = players.getPlayers(player.hostId)
                    for (let index = 0; index < players_.length; index++) {
                        
                        if(players_[index].onGame != false) {
                            let playerAdd = moduleGameCardCount_.getGame(game.pin)
                            if (players_[index].playerId != playerAdd.playerId) {
                                let cardsPlayer = this.generateCards()
                                moduleGameCardCount_.addGameCardCount(game.pin, gameId, players[index].playerId, cardsPlayer, true,0)
                                io.to(players_[index].playerId).emit('init-game-card-count', cardsPlayer)
                            }else {
                                io.to(players_[index].playerId).emit('init-game-card-count', cards)
                            }
                        }
                        
                    }

                    this.timerGameCard(io, players_)
                }
            }
        }
    }

    timerGameCard(io, players) {
        let time = 20;
            
        setInterval(() => {
            if(time >= 0) {
                for (let index = 0; index < players.length; index++) {
                    
                    if(players[index].onGame != false) {
                        io.to(players[index].playerId).emit('timer-game-card-count',time)
                    }
                    
                }
                time--;
            }
        }, 1000);
        
    }


    generateCards() {

        let cards = []
        for (let index = 0; index < 6; index++) {
            cards[index] = Math.floor(Math.random() * (6 - 1)) + 1
        }

        return cards
    }
}

const logicGameCardCount_ = new logicGameCardCount()
module.exports = {logicGameCardCount_}