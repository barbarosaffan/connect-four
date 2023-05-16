"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var fs = require("fs");
var Game = /** @class */ (function () {
    function Game(player1, player2) {
        this.board = Array(9)
            .fill(null)
            .map(function () { return Array(9).fill(null); });
        this.players = [player1, player2];
        this.currentPlayerIndex = Math.round(Math.random());
        this.moveCount = 0;
    }
    Game.prototype.makeMove = function (column) {
        if (column < 0 || column > 8) {
            console.log("Invalid move. Column number must be between 0 and 8.");
            return false;
        }
        if (this.board[0][column] !== null) {
            console.log("Invalid move. This column is full. Choose another one.");
            return false;
        }
        var row;
        for (var i = 0; i < 9; i++) {
            if (this.board[i][column] === null) {
                row = i;
            }
        }
        this.board[row][column] = this.players[this.currentPlayerIndex].color;
        if (this.checkWin(row, column)) {
            console.log("Player ".concat(this.players[this.currentPlayerIndex].name, " wins!"));
            return true;
        }
        this.moveCount++;
        if (this.moveCount >= 80) {
            console.log("The game is a draw.");
            return true;
        }
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
        return true;
    };
    Game.prototype.checkWin = function (row, column) {
        var playerColor = this.players[this.currentPlayerIndex].color;
        var directions = [
            { r: -1, c: 0 },
            { r: 1, c: 0 },
            { r: 0, c: -1 },
            { r: 0, c: 1 },
            { r: -1, c: -1 },
            { r: -1, c: 1 },
            { r: 1, c: -1 },
            { r: 1, c: 1 }, // down-right
        ];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var direction = directions_1[_i];
            var count = 1;
            for (var i = 1; i < 4; i++) {
                var r = row + direction.r * i;
                var c = column + direction.c * i;
                if (r >= 0 &&
                    r < 9 &&
                    c >= 0 &&
                    c < 9 &&
                    this.board[r][c] === playerColor) {
                    count++;
                }
                else {
                    break;
                }
            }
            for (var i = 1; i < 4; i++) {
                var r = row - direction.r * i;
                var c = column - direction.c * i;
                if (r >= 0 &&
                    r < 9 &&
                    c >= 0 &&
                    c < 9 &&
                    this.board[r][c] === playerColor) {
                    count++;
                }
                else {
                    break;
                }
            }
            if (count >= 4) {
                return true;
            }
        }
        return false;
    };
    Game.prototype.saveGame = function () {
        try {
            var gameState = {
                board: this.board,
                currentPlayerIndex: this.currentPlayerIndex,
                moveCount: this.moveCount,
            };
            fs.writeFileSync("gameState.json", JSON.stringify(gameState));
        }
        catch (error) {
            console.error("Failed to save game:", error);
        }
    };
    Game.prototype.loadGame = function () {
        try {
            var gameState = JSON.parse(fs.readFileSync("gameState.json", "utf8"));
            this.board = gameState.board;
            this.currentPlayerIndex = gameState.currentPlayerIndex;
            this.moveCount = gameState.moveCount;
        }
        catch (error) {
            console.error("Failed to load game:", error);
        }
    };
    return Game;
}());
exports.Game = Game;
