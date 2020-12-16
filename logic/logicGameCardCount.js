const { games } = require("../module/moduleGame")
const {moduleGameCardCount_} = require("../module/moduleGameCardCount")
const {players} = require("../module/modulePlayer")

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


    resultGameCardCount(socket, io) {
        return (params) => {
            if(params) {
                const player = players.getPlayer(socket.id)
                const game = games.getGame(player.hostId)
                const response = moduleGameCardCount_.addResultGameCard(game.gameId, player.playerId, params.result)
                let condition = 0

                if(!response) {
                    console.log("no se guardo el resultado")
                }else {
                    const gameCardCountResult = moduleGameCardCount_.getResultGameCardCount(game.gameId)
                    let accumulation = this.numberResult(gameCardCountResult)
                    const players_ = players.getPlayers(player.hostId)
                    if(accumulation >= 32) {
                        moduleGameCardCount_.editPlayerCondition(game.gameId, player.playerId)
                        moduleGameCardCount_.editPlayerPoint(game.gameId)
                        let games = moduleGameCardCount_.getGames(game.pin)
                        let countPlayer = games.length - 1
                        games.forEach(element => {
                            if(element.condition == false) {
                                condition += 1
                            }
                        });

                        if(condition >= countPlayer) {
                            for (let index = 0; index < players_.length; index++) {
                                io.to(players_[index].playerId).emit('position-game-card-count', this.positionGameCardCount(games))
                            }
                        } else {
                            for (let index = 0; index < players_.length; index++) {
                                io.to(players_[index].playerId).emit('player-eliminated', {
                                    playerId: player.playerId,
                                    accumulation: accumulation,
                                    cards: this.generateCards()
                                })
                            }
                            this.timerResultGameCard(io, players_)
                        }

                        
                        moduleGameCardCount_.removeResultGameCardCount(game.gameId)
                        
                    } else {
                        for (let index = 0; index < players_.length; index++) {
                            io.to(players_[index].playerId).emit('result-game-card-count', {
                                cardPlayer: params.result,
                                accumulation: accumulation
                            })
                        }

                        this.timerResultGameCard(io, players_)
                    }

                }
                
            }
        }
    }

    timerResultGameCard(io, players) {
        let time = 2;
            
        setInterval(() => {
            if(time >= 0) {
                if(time == 0) {
                    this.timerGameCard(io, players)
                }
                time--;
            }
        }, 1000);
        
    }

    positionGameCardCount(players) {
        let position = []

        players.forEach(element => {
            let player = {
                playerId: element.playerId,
                points: element.points
            }
            position.push(player)
        });

        position.sort(this.descendingOrder)

        return this.positionNumberGameCardCount(position)
    }

    positionNumberGameCardCount(players) {
        let positions = []
        let position
        
        for (let index = 0; index < players.length; index++) {
            if (index > 0) {
                if(players[index-1].points == players[index].points) {
                    position = {
                        playerId: players[index].playerId,
                        points: players[index].points,
                        position: index
                    }
                } else {
                    position = {
                        playerId: players[index].playerId,
                        points: players[index].points,
                        position: index + 1
                    }
                }
            }else {
                position = {
                    playerId: players[index].playerId,
                    points: players[index].points,
                    position: 1
                }
            }
            positions.push(position)
        }

        return positions
    }

    descendingOrder(a, b) {
        return b.points - a.points
    }

    numberResult(players) {
        let result = 0

        players.forEach(element => {
            result += element.result
        });

        return result
    }


    generateCards() {

        let cards = []
        for (let index = 0; index < 6; index++) {
            let card = {
                number: Math.floor(Math.random() * (6 - 1)) + 1
            }
            cards.push(card)
        }

        return cards
    }
}

const logicGameCardCount_ = new logicGameCardCount()
module.exports = {logicGameCardCount_}