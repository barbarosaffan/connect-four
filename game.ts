import * as fs from "fs";
import { Player } from "./player";

export class Game {
  board: (string | null)[][];
  players: Player[];
  currentPlayerIndex: number;
  moveCount: number;

  constructor(player1: Player, player2: Player) {
    this.board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
    this.players = [player1, player2];
    this.currentPlayerIndex = Math.round(Math.random());
    this.moveCount = 0;
  }

  makeMove(column: number): boolean {
    if (column < 0 || column > 8) {
      console.log("Invalid move. Column number must be between 0 and 8.");
      return false;
    }

    if (this.board[0][column] !== null) {
      console.log("Invalid move. This column is full. Choose another one.");
      return false;
    }

    let row;
    for (let i = 0; i < 9; i++) {
      if (this.board[i][column] === null) {
        row = i;
      }
    }

    this.board[row][column] = this.players[this.currentPlayerIndex].color;

    if (this.checkWin(row, column)) {
      console.log(`Player ${this.players[this.currentPlayerIndex].name} wins!`);
      return true;
    }

    this.moveCount++;

    if (this.moveCount >= 80) {
      console.log("The game is a draw.");
      return true;
    }

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;

    return true;
  }

  checkWin(row: number, column: number): boolean {
    const playerColor = this.players[this.currentPlayerIndex].color;
    const directions = [
      { r: -1, c: 0 }, // up
      { r: 1, c: 0 }, // down
      { r: 0, c: -1 }, // left
      { r: 0, c: 1 }, // right
      { r: -1, c: -1 }, // up-left
      { r: -1, c: 1 }, // up-right
      { r: 1, c: -1 }, // down-left
      { r: 1, c: 1 }, // down-right
    ];

    for (let direction of directions) {
      let count = 1;

      for (let i = 1; i < 4; i++) {
        const r = row + direction.r * i;
        const c = column + direction.c * i;

        if (
          r >= 0 &&
          r < 9 &&
          c >= 0 &&
          c < 9 &&
          this.board[r][c] === playerColor
        ) {
          count++;
        } else {
          break;
        }
      }

      for (let i = 1; i < 4; i++) {
        const r = row - direction.r * i;
        const c = column - direction.c * i;

        if (
          r >= 0 &&
          r < 9 &&
          c >= 0 &&
          c < 9 &&
          this.board[r][c] === playerColor
        ) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 4) {
        return true;
      }
    }

    return false;
  }
  saveGame(): void {
    try {
      const gameState = {
        board: this.board,
        currentPlayerIndex: this.currentPlayerIndex,
        moveCount: this.moveCount,
      };
      fs.writeFileSync("gameState.json", JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save game:", error);
    }
  }

  loadGame(): void {
    try {
      const gameState = JSON.parse(fs.readFileSync("gameState.json", "utf8"));

      this.board = gameState.board;
      this.currentPlayerIndex = gameState.currentPlayerIndex;
      this.moveCount = gameState.moveCount;
    } catch (error) {
      console.error("Failed to load game:", error);
    }
  }
}
