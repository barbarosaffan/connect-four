import * as fs from 'fs';
import * as readline from 'readline';

const board: number[][] = Array.from({length: 10}, () => Array(10).fill(0));
let turnPlayer = 1;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function logFile(column: number): void {
  fs.appendFileSync(
    'log.txt',
    // `${turnPlayer}. Oyuncu ${column} sütununa yerleştirdi.\n`
    `Player ${turnPlayer} placed move to column ${column}.\n`
  );
}

function printBoard(): void {
  for (let i = 9; i >= 1; i--) {
    let row = '';
    for (let j = 1; j <= 9; j++) {
      row += board[i][j] + ' ';
    }
    console.log(row);
  }
}

function checkGame(): number {
  for (let i = 1; i <= 9; i++) {
    for (let j = 1; j <= 9; j++) {
      if (i + 3 <= 9 && j + 3 <= 9) {
        if (
          board[i][j] !== 0 &&
          board[i][j] === board[i + 1][j + 1] &&
          board[i][j] === board[i + 2][j + 2] &&
          board[i][j] === board[i + 3][j + 3]
        ) {
          return board[i][j];
        }
        if (
          board[i][j] !== 0 &&
          board[i][j] === board[i + 1][j - 1] &&
          board[i][j] === board[i + 2][j - 2] &&
          board[i][j] === board[i + 3][j - 3]
        ) {
          return board[i][j];
        }
      }
      if (j + 3 <= 9) {
        if (
          board[i][j] !== 0 &&
          board[i][j] === board[i][j + 1] &&
          board[i][j] === board[i][j + 2] &&
          board[i][j] === board[i][j + 3]
        ) {
          return board[i][j];
        }
      }
      if (i + 3 <= 9) {
        if (
          board[i][j] !== 0 &&
          board[i][j] === board[i + 1][j] &&
          board[i][j] === board[i + 2][j] &&
          board[i][j] === board[i + 3][j]
        ) {
          return board[i][j];
        }
      }
    }
  }
  return 0;
}

async function addToken(): Promise<void> {
  const input = await new Promise<number>(resolve => {
    rl.question('', (answer: string) => {
      resolve(parseInt(answer));
    });
  });

  if (input === 0) {
    return gameMenu();
  }

  board[board[0][input] + 1][input] = turnPlayer;
  board[0][input] += 1;
  logFile(input);
  printBoard();
  const gameStatus = checkGame();
  if (gameStatus !== 0) {
    console.log(`Winner is: ${gameStatus}`);
    return;
  }
  turnPlayer = turnPlayer === 1 ? 2 : 1;
  return playLoop();
}

async function playLoop(): Promise<void> {
  if (turnPlayer === 1) {
    console.log('Press 0 for main menu.');
    console.log('1st Player: Which column do you want to place?');
    return addToken();
  } else if (turnPlayer === 2) {
    console.log('Press 0 for main menu.');
    console.log('2nd Player: Which column do you want to place?');
    return addToken();
  }
}

function saveBoard() {
  let data = '';
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      data += board[i][j] + ' ';
    }
    data += '\n';
  }
  data += turnPlayer + '\n';
  fs.writeFileSync('game_data.txt', data);
  console.log('Game saved.');
}

function loadBoard() {
  const data = fs.readFileSync('game_data.txt', 'utf8');
  const lines = data.split('\n');
  for (let i = 0; i < 10; i++) {
    const row = lines[i].split(' ').map((x: string) => parseInt(x));
    for (let j = 0; j < 10; j++) {
      board[i][j] = row[j];
    }
  }
  turnPlayer = parseInt(lines[10]);
  console.log('Oyun yüklendi.');
}

async function gameMenu(): Promise<void> {
  console.log('1: Start');
  console.log('2: Save Game');
  console.log('3: Load Game');
  console.log('4: Exit');

  const gameChoice = await new Promise<number>(resolve => {
    rl.question('', (answer: string) => {
      resolve(parseInt(answer));
    });
  });

  if (gameChoice === 1) {
    printBoard();
    return playLoop();
  } else if (gameChoice === 2) {
    saveBoard();
    return gameMenu();
  } else if (gameChoice === 3) {
    loadBoard();
    return gameMenu();
  } else if (gameChoice === 4) {
    rl.close();
    process.exit(0);
  } else {
    return gameMenu();
  }
}

async function main() {
  await gameMenu();
  process.exit(0);
}

main();
