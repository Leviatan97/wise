const { moduleGameCard_ } = require("../module/moduleGameCard")
const { players } = require("../module/modulePlayer")
const { games } = require("../module/moduleGame")

class logicGameCard {
    constructor() {
        this.rounds = 1;
    }

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
                    cards,
                    1
                )

                if(!request) {
                    console.log('no se creo la partida')
                } else {
                    console.log(`partida generada por el socket ${socket.id} con las siguientes cartas ${cards}`)
                    let players_ = players.getPlayers(player.hostId)
                    for (let index = 0; index < players_.length; index++) {
                        
                        if(players_[index].onGame != false) {
                            let playerAdd = moduleGameCard_.getGame(game.pin)
                            if (players_[index].playerId != playerAdd.playerId) {
                                let cardsPlayer = this.generateCards()
                                moduleGameCard_.addGameCard(game.pin, gameId, players[index].playerId, cardsPlayer, 1)
                                io.to(players_[index].playerId).emit('init-game-card', cardsPlayer)
                            }else {
                                io.to(players_[index].playerId).emit('init-game-card', cards)
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
                        io.to(players[index].playerId).emit('timer-game-card',time)
                    }
                    
                }
                console.log("segundos cartas "+ time)
                time--;
            }
        }, 1000);
        
    }

    resultGameCard(socket, io) {
        return (params) => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameCard = moduleGameCard_.getGame(game.pin)
            let gamesCard = moduleGameCard_.getGames(game.pin)
            let condition = false;
            let points = false

            const response = moduleGameCard_.addResultGameCard(gameCard.gameId, player.playerId, params.result)
            if(!response) {
                console.log('no se guardo el resultado')
            } else {
                console.log(`se guardo el resultado ${params.result} del socket ${socket.id}`)
                const players_ = players.getPlayers(player.hostId)
                const playersResult = moduleGameCard_.getResultGameCard(gameCard.gameId)
                console.log(gamesCard)
                if(gamesCard.length == playersResult.length) {
                    let res  = this.responseGameCard(gameCard.gameId)
                    this.addPointsRoundCard(res, gameCard.gameId)
                    let games = moduleGameCard_.getGames(game.pin)
                    

                    games.forEach(element => {
                        let point = moduleGameCard_.getPointGameCard(element.gameId, element.playerId)
                        if(element.round >= 6) {
                            condition = true
                        }

                        if(point.points >= 3) {
                            points = true
                        }
                    });
                    
                    if(condition == true) {
                        for (let index = 0; index < players_.length; index++) {
                            io.to(players_[index].playerId).emit('position-game-card', this.positionGameCard(games))
                        }
                    } else if(points == true) {

                        for (let index = 0; index < players_.length; index++) {
                            io.to(players_[index].playerId).emit('position-game-card', this.positionGameCard(games))
                        }
                        
                    } else {
                        for (let index = 0; index < players_.length; index++) {
                            io.to(players_[index].playerId).emit('response-game-card', this.positionNumberGameCard(res))
                        }
                        moduleGameCard_.removeResultGameCard(gameCard.gameId)
                        this.timerNewRoundGame(io, players_)
                    }

                    
                    
                }
            }
        }
    }

    responseGameCard(gameId) {
        const resultsPlayers = moduleGameCard_.getResultGameCard(gameId)
        let positionRound = []
        resultsPlayers.forEach(element => {
            let resultPlayer = {
                playerId: element.playerId,
                result: element.result
            }

            positionRound.push(resultPlayer)
        });

        positionRound.sort(this.descendingOrder)

        
        return positionRound;
    }

    positionGameCard(players) {
        let position = []

        players.forEach(element => {
            let player = {
                playerId: element.playerId,
                points: element.points
            }
            position.push(player)
        });

        position.sort(this.descendingOrder)

        return this.positionNumberGameCard(position)
    }

    positionNumberGameCard(players) {
        let positions = []
        let position
        
        for (let index = 0; index < players.length; index++) {
            if (index > 0) {
                if(players[index-1].points == players[index].points) {
                    position = {
                        playerId: players[index].playerId,
                        points: players[index].result,
                        position: index
                    }
                } else {
                    position = {
                        playerId: players[index].playerId,
                        points: players[index].result,
                        position: index + 1
                    }
                }
            }else {
                position = {
                    playerId: players[index].playerId,
                    points: players[index].result,
                    position: 1
                }
            }
            positions.push(position)
        }

        return positions
    }

    addPointsRoundCard(players, gameId) {
        let positions = this.positionNumberGameCard(players)

        for (let index = 0; index < positions.length; index++) {
            
            if(positions[0].result == positions[index].result) {
                let pointsPlayer = moduleGameCard_.getPointGameCard(gameId, positions[index].playerId)
                if(!pointsPlayer) {
                    moduleGameCard_.addPointGameCard(
                        gameId,
                        positions[index].playerId,
                        1
                    )
                } else {
                    moduleGameCard_.editPointsGameCard(gameId, positions[index].playerId)
                }
            }
            moduleGameCard_.addRoundGameCard(positions[index].playerId)
        }
    }

    descendingOrder(a, b) {
        return b.result - a.result
    }

    timerNewRoundGame(io, players) {
        let time = 5;
            
        setInterval(() => {
            if(time >= 0) {
                for (let index = 0; index < players.length; index++) {
                    
                    if(players[index].onGame != false) {
                        io.to(players[index].playerId).emit('timer-round-card',time)
                    }
                    
                }
                console.log("segundos ronda cartas"+ time)
                if(time == 0) {
                    this.timerGameCard(io, players)
                }
                time--;
            }
        }, 1000);
        
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

const logicGameCard_ = new logicGameCard()
module.exports = {logicGameCard_}