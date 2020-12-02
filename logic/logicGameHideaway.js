const { moduleGameHideaway_ } = require("../module/moduleGameHideaway");
const { players } = require("../module/modulePlayer");
const { games } = require("../module/moduleGame")

class logicGameHideaway {
    constructor() {}

    createGameHideaway(socket, io) {
        return () => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameId = Math.floor(Math.random() * (9000 - 1000)) + 1000
            const gameHideaway = moduleGameHideaway_.getGame(game.pin)
            const operation = this.generateOperation()
            const values = this.generateOtherValues(operation.result)

            if(!gameHideaway) {
                const request = moduleGameHideaway_.addGameHideaway(
                    game.pin, 
                    gameId, 
                    player.playerId,
                    true
                )

                const round = moduleGameHideaway_.addRoundGameHideaway(
                    gameId,
                    operation.operation,
                    operation.result,
                    values.tower,
                    values.castle,
                    values.pit,
                    values.rock
                )

                if(!request && !round) {
                    console.log('no se creo la partida')
                } else {
                    console.log(`partida generada por el socket ${socket.id}, la operación es ${operation.operation} = ${operation.result}`)
                    let players_ = players.getPlayers(player.hostId)
                    this.addPlayersGameHideAway(
                        players_,
                        game.pin,
                        gameId,
                        true
                    )

                    for (let index = 0; index < players_.length; index++) {
                        
                        if(players_[index].onGame != false) {
                            io.to(players_[index].playerId).emit('init-game-hide-away',{
                                operation: operation.operation,
                                tower: values.tower,
                                castle: values.castle,
                                pit: values.pit,
                                rock: values.rock
                            })
                        }
                        
                    }

                    console.log('Se creo la partida')
                    this.timerGameHideaway(io, players_)
                }
            }
        }
    }

    timerGameHideaway(io, players) {
        let time = 20;
            
        setInterval(() => {
            if(time >= 0) {
                for (let index = 0; index < players.length; index++) {
                    
                    if(players[index].onGame != false) {
                        io.to(players[index].playerId).emit('timer-game-hideaway',time)
                    }
                    
                }
                time--;
            }
        }, 1000);
        
    }

    resultGameHideaway(socket, io) {
        return (params) => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameHideaway = moduleGameHideaway_.getGame(game.pin)
            let gamesHideaway = moduleGameHideaway_.getGames(game.pin)
            let condition = 0;

            const response = moduleGameHideaway_.addResultGameHideaway(gameHideaway.gameId, player.playerId, params.result)
            if(!response) {
                console.log('no se guardo el resultado')
            } else {
                console.log(`se guardo el resultado ${params.result} del socket ${socket.id}`)
                const players_ = players.getPlayers(player.hostId)
                const playersResult = moduleGameHideaway_.getResultGameHideaway(gameHideaway.gameId)
                
                if(gamesHideaway.length == playersResult.length) {
                    let res  = this.responseGameHideaway(gameHideaway.gameId)
                    let games = moduleGameHideaway_.getGames(game.pin)
                    
                    games.forEach(element => {
                        console.log(element)
                    });
                    for(let i = 0; i < games.length_; i++) {
                        
                        if(games[i].condition == false) {
                            condition ++;
                        }
                        console.log(games[i])
                    }
                    console.log(condition)
                    if(condition >= games.length_-1) {
                        for (let index = 0; index < players_.length; index++) {
                            io.to(players_[index].playerId).emit('position-game-hideaway', {
                                position: "entro a posiciones",
                                res: res
                            })
                        }
                    } else {
                        for (let index = 0; index < players_.length; index++) {
                            io.to(players_[index].playerId).emit('response-game-hideaway', res)
                        }
                        this.timerNewRoundGame(io, players_)
                    }
                    
                }
            }
        }
    }

    timerNewRoundGame(io, players) {
        let time = 2;
            
        setInterval(() => {
            if(time >= 0) {
                for (let index = 0; index < players.length; index++) {
                    
                    if(players[index].onGame != false) {
                        io.to(players[index].playerId).emit('timer-round-hideaway',time)
                    }
                    
                }
                time--;
            }
        }, 1000);
        
    }

    responseGameHideaway(gameId) {
        const gameRound = moduleGameHideaway_.getRoundGameHideaway(gameId)
        const resultsPlayers = moduleGameHideaway_.getResultGameHideaway(gameId)
        
        resultsPlayers.forEach(element => {
            if(element.result == gameRound[0].result) {
                moduleGameHideaway_.addConditionGameHideaway(element.gameId, element.playerId, true);
            } else {
                moduleGameHideaway_.editPlayerCondition(element.gameId, element.playerId);
            }
        });
        moduleGameHideaway_.removeRoundGameHideaway()
        return gameRound[0].result;
    }

    newRoundGameHideaway(socket, io) {
        return () => {
            const player = players.getPlayer(socket.id)
            const game = games.getGame(player.hostId)
            const gameHideaway = moduleGameHideaway_.getGame(game.pin)
            const operation = this.generateOperation()
            const values = this.generateOtherValues(operation.result)
            const rounds = moduleGameHideaway_.getRoundGameHideaway()
            
            if(!rounds) {
                const round = moduleGameHideaway_.addRoundGameHideaway(
                    gameHideaway.gameId,
                    operation.operation,
                    operation.result,
                    values.tower,
                    values.castle,
                    values.pit,
                    values.rock,
                )

                if(!round) {
                    console.log("no se creo la partida");
                } else {
                    console.log(`se creo la siguiente ronda con el socket ${socket.id}`)
                    const players_ = players.getPlayers(player.hostId)

                    for (let index = 0; index < players_.length; index++) {
                        
                        if(players_[index].onGame != false) {
                            io.to(players_[index].playerId).emit('init-game-hide-away',{
                                operation: operation.operation,
                                tower: values.tower,
                                castle: values.castle,
                                pit: values.pit,
                                rock: values.rock
                            })
                        }
                        
                    }

                }
            }
        }
    }

    addPlayersGameHideAway(players, pin, gameId, condition) {
        for (let index = 0; index < players.length; index++) {
            let playerAdd = moduleGameHideaway_.getGame(pin)
            if(players[index].onGame != false && players[index].playerId != playerAdd.playerId && condition != false) {
                moduleGameHideaway_.addGameHideaway(
                    pin, 
                    gameId, 
                    players[index].playerId,
                    condition
                )
            }
            
        }
    }

    generateOperation() {
        let number1 = Math.floor(Math.random() * (31 - 1)) + 1
        let number2 = Math.floor(Math.random() * (31 - 1)) + 1
        let number3 = Math.floor(Math.random() * (31 - 1)) + 1
        let operations = ['+','-']
        let selectOperation = Math.floor(Math.random() * (2 - 0))
        let operation
        let result
        switch (operations[selectOperation]) {
            case '+':
                    selectOperation = Math.floor(Math.random() * (2 - 0))
                    switch (operations[selectOperation]) {
                        case '+':
                                result = number1 + number2 + number3
                                operation = `${number1} + ${number2} + ${number3}`
                            break;

                        case '-':
                                result = number1 + number2 - number3
                                operation = `${number1} + ${number2} - ${number3}`
                            break;
                    
                        default:
                            break;
                    }
                break;
            case '-':
                    selectOperation = Math.floor(Math.random() * (2 - 0))
                    switch (operations[selectOperation]) {
                        case '+':
                                result = number1 - number2 + number3
                                operation = `${number1} - ${number2} + ${number3}`
                            break;

                        case '-':
                                result = number1 - number2 - number3
                                operation = `${number1} - ${number2} - ${number3}`
                            break;
                    
                        default:
                            break;
                    }
                break;
            default:
                break;
        }

        let opRes = {
            operation: operation,
            result: result
        }
        return opRes
    }

    generateOtherValues(result) {
        let response = ['tower', 'castle', 'pit', 'rock']
        let selectRepose = Math.floor(Math.random() * (4 - 0))
        let responses
        let tower
        let castle
        let pit
        let rock

        switch (response[selectRepose]) {
            case 'tower':
                    castle = Math.floor(Math.random() * (result - (result-3))) + (result-3)
                    pit = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                    rock = Math.floor(Math.random() * ((result + 3) - result)) + (result)
                    while (this.checkValues(result, castle, pit, rock) == false) {
                        castle = Math.floor(Math.random() * (result - (result-3))) + (result-3)
                        pit = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                        rock = Math.floor(Math.random() * ((result + 3) - result)) + (result)
                    }
                    responses = {
                        tower: result,
                        castle: castle,
                        pit: pit,
                        rock: rock
                    }
                break;

            case 'castle':
                    tower = Math.floor(Math.random() * ((result + 3) - result)) + (result)
                    pit = Math.floor(Math.random() * (result - (result-3))) + (result-3)
                    rock = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                    while (this.checkValues(tower, result, pit, rock) == false) {
                        tower = Math.floor(Math.random() * ((result + 3) - result)) + (result)
                        pit = Math.floor(Math.random() * (result - (result-3))) + (result-3)
                        rock = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                    }
                    responses = {
                        tower: tower,
                        castle: result,
                        pit: pit,
                        rock: rock
                    }
                break;

            case 'pit':
                    tower = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                    castle = Math.floor(Math.random() * ((result + 3) - result)) + (result)
                    rock = Math.floor(Math.random() * (result - (result-3))) + (result-3)

                    while (this.checkValues(tower, castle, result, rock) == false) {
                        tower = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                        castle = Math.floor(Math.random() * ((result + 3) - result)) + (result)
                        rock = Math.floor(Math.random() * (result - (result-3))) + (result-3)
                    }

                    responses = {
                        tower: tower,
                        castle: castle,
                        pit: result,
                        rock: rock
                    }
                break;

            case 'rock':
                tower = Math.floor(Math.random() * (result - (result-3))) + (result-3)
                castle = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                pit = Math.floor(Math.random() * ((result + 3) - result)) + (result)

                while (this.checkValues(tower, castle, pit, result) == false) {
                    tower = Math.floor(Math.random() * (result - (result-3))) + (result-3)
                    castle = Math.floor(Math.random() * ((result + 3) - (result-3))) + (result-3)
                    pit = Math.floor(Math.random() * ((result + 3) - result)) + (result)
                }

                responses = {
                    tower: tower,
                    castle: castle,
                    pit: pit,
                    rock: result
                }
                break;
            default:
                break;
        }

        return responses
    }

    checkValues(tower, castle, pit, rock) {
        let res
        if(
            tower != castle && 
            tower != pit && 
            tower != rock && 
            castle != pit && 
            castle != rock && 
            pit != rock
        ) {
            res = true;
        } else {
            res = false;
        }

        return res
    }
    
}

const logicGameHideaway_ = new logicGameHideaway()
module.exports = {logicGameHideaway_}