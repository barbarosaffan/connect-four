"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(name, color) {
        this.name = name;
        this.color = color;
        this.numMoves = 0;
    }
    Player.prototype.makeMove = function () {
        if (this.numMoves < 40) {
            this.numMoves++;
            return true;
        }
        else {
            console.log("Player ".concat(this.name, " has no more moves left."));
            return false;
        }
    };
    return Player;
}());
exports.Player = Player;
