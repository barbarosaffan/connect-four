import readline from "readline";
import { Player } from "./player.js";
import { Game } from "./game.js";

let player1 = new Player("Alice", "R");
let player2 = new Player("Bob", "Y");

let game = new Game(player1, player2);

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function playTurn() {
  console.log(
    `Player ${
      game.players[game.currentPlayerIndex].name
    }'s turn. Choose a column (0-8):`
  );
  rl.question("", function (column) {
    if (game.makeMove(parseInt(column))) {
      console.log(game.board);
      if (game.checkWin()) {
        console.log(
          `Player ${game.players[game.currentPlayerIndex].name} wins!`
        );
        return rl.close();
      }
      if (game.moveCount >= 80) {
        console.log("The game is a draw.");
        return rl.close();
      }
    }
    playTurn();
  });
}

playTurn();
