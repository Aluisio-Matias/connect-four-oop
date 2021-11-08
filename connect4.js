/* Connect Four OOP version:
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game  {
    constructor(p1, p2, height = 6, width = 7){
      this.players = [p1, p2];
      this.height = height;
      this.width = width;
      this.currPlayer = p1;
      this.makeBoard();
      this.makeHtmlBoard();
      this.gameOver = false;
  }
  //board = array of rows, each row is array of cells  (board[y][x])
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({length: this.width}));
    }
  };
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = '';

    //create the top of the columns where the player can click and add the piece to that column
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);

    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    board.append(top); 

    
    //Create the main part of the board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr"); //create 6 rows based on the HEIGHT=6 variable

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td"); //add 7 cells to each row WIDTH=7 variable
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      board.append(row); //appending the rows and cells to the board variable
    }
  };

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height -1; y >= 0; y--) {
      if(!this.board[y][x]){
      return y;
      }
    }
    return null;
  };
  /*placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div'); 
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece); 
  }

  /** endGame: announce game end */
  //create pop up alert message when game is over
  //stop players from continuing to click by removing the eventlistener
  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  };
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
    return;
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('This game was a tie!\nClick the Start Game button to begin a new game!');
    }
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player with ${this.currPlayer.color} color tokens has won the game!\nClick the Start Game button to begin a new game!`);
    }
    // switch currPlayer 1 <-> 2 -- boolean exp. if p1 played then its p2 otherwise p1 again
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0]
  };

  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells => 
      cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        //checking for all conditions to find the 4 matching cells (pieces) on the game board
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        //check horizontally if all 4 pieces match 
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        //check vertically if all 4 pieces match
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        //check diagonally right if all 4 pieces match
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        //check diagonally left if all 4 pieces match

        //check if any of the conditions above are true to find the winner
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}
  class Player {
    constructor(color) {
      this.color = color;
    }
  }

document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1, p2);
});