export class Player {
  name: string;
  color: string;
  numMoves: number;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
    this.numMoves = 0;
  }

  makeMove() {
    if (this.numMoves < 40) {
      this.numMoves++;
      return true;
    } else {
      console.log(`Player ${this.name} has no more moves left.`);
      return false;
    }
  }
}
