const grid = document.getElementById("game");
const flagLeft = document.getElementById("flagLeft");
const resetBtn = document.getElementById("reset");

const width = 16;
const bombAmount = 10;
let squares = [];
let isGameOver = false;
let flags = 0;

// Create board
function createBoard() {
  const bombsArray = Array(bombAmount).fill("bomb");
  const emptyArray = Array(width * width - bombAmount).fill("valid");
  const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add("cell");
    square.classList.add(gameArray[i]);
    grid.appendChild(square);
    squares.push(square);

    // left click
    square.addEventListener("click", function () {
      click(square);
    });

    // right click
    square.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      addFlag(square);
    });
  }

  // Add numbers
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;

    if (squares[i].classList.contains("valid")) {
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
      if (i > 15 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
      if (i > 16 && squares[i - width].classList.contains("bomb")) total++;
      if (i > 17 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++;
      if (i < 254 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
      if (i < 240 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
      if (i < 239 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
      if (i < 240 && squares[i + width].classList.contains("bomb")) total++;

      squares[i].setAttribute("data", total);
    }
  }
}

createBoard();

// Add flag
function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains("checked") && (flags < bombAmount)) {
    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      square.innerHTML = "🚩";
      flags++;
      checkForWin();
    } else {
      square.classList.remove("flag");
      square.innerHTML = "";
      flags--;
    }
    flagLeft.innerHTML = "Flags left: " + (bombAmount - flags);
  }
}

// Click
function click(square) {
  let currentId = square.id;
  if (isGameOver) return;
  if (square.classList.contains("checked") || square.classList.contains("flag")) return;
  if (square.classList.contains("bomb")) {
    gameOver(square);
  } else {
    let total = square.getAttribute("data");
    if (total != 0) {
      square.classList.add("checked");
      square.innerHTML = total;
      return;
    }
    checkSquare(square, currentId);
  }
  square.classList.add("checked");
}

// Check neighboring squares
function checkSquare(square, currentId) {
  const isLeftEdge = (currentId % width === 0);
  const isRightEdge = (currentId % width === width - 1);

  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 15 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 16) {
      const newId = squares[parseInt(currentId) - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId > 17 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 254 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 240 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 239 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (currentId < 240) {
      const newId = squares[parseInt(currentId) + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 10);
}

// Game over
function gameOver(square) {
  isGameOver = true;
  alert("YOU LOSE!");

  // show all bombs
  squares.forEach(square => {
    if (square.classList.contains("bomb")) {
      square.innerHTML = "💣";
      square.classList.add("bomb");
    }
  });
}

// Win
function checkForWin() {
  let matches = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
      matches++;
    }
  }
  if (matches === bombAmount) {
    isGameOver = true;
    alert("YOU WIN!");
  }
}

// Reset
resetBtn.addEventListener("click", () => {
  grid.innerHTML = "";
  squares = [];
  isGameOver = false;
  flags = 0;
  createBoard();
  flagLeft.innerHTML = "Flags left: " + bombAmount;
});

// Initialize flag count
flagLeft.innerHTML = "Flags left: " + bombAmount;
