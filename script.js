let playerX = null;
let playerO = null;
let currentPlayer = null;
let gameOver = false; 

class Player {
  constructor(name, marker) {
    this.name = name;
    this.marker = marker;
    this.wins = 0; 
  }

  win() {
    this.wins++;
    alert(`${this.name} wins! Total Wins: ${this.wins}`);
    gameOver = true; 
    updateStatus(); 
  }
}

// Create player logic
function createPlayer(markerId, marker) {
  const markerChoice = document.querySelector(markerId);

  // Disable the button after a player is assigned
  markerChoice.disabled = true;

  const playerName = prompt(`Enter your name to play as ${marker}:`);

  if (playerName) {
    const newPlayer = new Player(playerName, marker);

    // Assign players based on their marker
    if (marker === "X") {
      playerX = newPlayer;
      currentPlayer = playerX; 
      createAI(); 
      updateStatus();
      startGame(); 
    } else {
      playerO = newPlayer;
      currentPlayer = playerO; 
      createAI(); 
      updateStatus();
      startGame(); 
    }

    console.log(`${newPlayer.name} is playing as ${newPlayer.marker}`);
    hidePlayerButtons(); 
  } else {
    alert("Player name is required!");
  }
}

// Function to create the AI 
function createAI() {
  if (!playerX || !playerO) {
    if (!playerX) {
      playerX = new Player("AI", "X");
    }
    if (!playerO) {
      playerO = new Player("AI", "O");
    }
  }
  updateStatus(); 
}

// Hide the player buttons after one is clicked
function hidePlayerButtons() {
  document.getElementById("markerX").style.display = "none";
  document.getElementById("markerO").style.display = "none";
}

// Create player buttons and attach event listeners
const xButton = document.getElementById("markerX");
const oButton = document.getElementById("markerO");

xButton.addEventListener("click", () => {
  if (!playerX) {
    createPlayer("#markerX", "X");
  } else {
    alert("Player X is already chosen!");
  }
});

oButton.addEventListener("click", () => {
  if (!playerO) {
    createPlayer("#markerO", "O");
  } else {
    alert("Player O is already chosen!");
  }
});

// Updates the game status display
function updateStatus() {
  const playerstatus = document.getElementById('playerStatus');
  const aistatus = document.getElementById('aiStatus');
  playerstatus.textContent = `Player X: ${playerX ? playerX.name : 'Not yet selected'} (${playerX ? playerX.wins : 0} wins)`
  aistatus.textContent = `Player O: ${playerO ? playerO.name : 'Not yet selected'} (${playerO ? playerO.wins : 0} wins)`

  ;
}

// Initialize the game board
function createGameBoard() {
  const board = document.getElementById("board");

  // Dynamically create cells for the board
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i; 

    // Add event listener for cell click
    cell.addEventListener("click", () => {
      if (currentPlayer && !cell.textContent && !gameOver) {
        cell.textContent = currentPlayer.marker; 
        if (checkWin()) {
          currentPlayer.win(); 
        } else {
          switchPlayer(); 
        }
      }
    });

    board.appendChild(cell);
  }
}

// Start the game, trigger the first move for the AI if O was selected
function startGame() {
  
  if (playerX && playerO) {
    if (playerX.name === 'AI' && !gameOver) {
      currentPlayer = playerX;
      aiMove(); 
    } else if (playerO.name === 'AI' && !gameOver) {
      currentPlayer = playerX;
      updateStatus();
    }
  }
}

// Switch player after a move
function switchPlayer() {
  currentPlayer = currentPlayer === playerX ? playerO : playerX;
  updateStatus();

  // If AI is playing, make a move after a small delay
  if (currentPlayer.name === "AI" && !gameOver) {
    setTimeout(aiMove, 500); 
  }
}

// AI Move (simple random move)
function aiMove() {
  const emptyCells = Array.from(document.querySelectorAll(".cell"))
    .filter(cell => !cell.textContent); 
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = currentPlayer.marker; 
    if (checkWin()) {
      currentPlayer.win(); 
    } else {
      switchPlayer(); 
    }
  }
}

// Check for a win 
function checkWin() {
  const cells = document.querySelectorAll(".cell");
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winningCombination.some(combination => {
    const [a, b, c] = combination;
    return cells[a].textContent === currentPlayer.marker &&
           cells[b].textContent === currentPlayer.marker &&
           cells[c].textContent === currentPlayer.marker;
  });
}

// Reset the board after a win or reset
function resetBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.textContent = "");
  gameOver = false; 
  updateStatus(); 
}

// Start a new game (reset the board but keep the scores)
function newGame() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.textContent = "");

  gameOver = false; 

  // If the player is O, the AI must go first
  if (playerX.name === "AI") {
    currentPlayer = playerX; 
    aiMove(); 
  } else if (playerO.name === "AI"){
    currentPlayer = playerX; 
  }

  updateStatus(); 
}

// Reset the entire match (clear the board, reset scores, and marker choices)
function newMatch() {
  playerX = null;
  playerO = null;
  currentPlayer = null;
  gameOver = false;

  // Re-enable the buttons and show them again
  document.getElementById("markerX").style.display = "block";
  document.getElementById("markerO").style.display = "block";
  document.getElementById("markerX").disabled = false;
  document.getElementById("markerO").disabled = false;

  // Clear the game board
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.textContent = "");

  updateStatus(); // Update status for a fresh start
}

// Initialize the game when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  createGameBoard();
  updateStatus(); // Set initial status

  // "New Game" button
  const newGameButton = document.querySelector("#newGame")
  newGameButton.addEventListener("click", newGame);
  

  // "New Match" button
  const newMatchButton = document.querySelector("#newMatch")
  newMatchButton.addEventListener("click", newMatch);
  
});
