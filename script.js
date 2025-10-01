// Ensure every square has correct class and dataset
square.setAttribute("id", i);
if (bombs.includes(i)) {
  square.className = "bomb";
} else {
  square.className = "valid";
  square.setAttribute("data", count); // strict requirement
}
grid.appendChild(square);

// On click
function click(square) {
  if (square.classList.contains("checked") || square.classList.contains("flag")) return;
  if (square.classList.contains("bomb")) {
    gameOver();
  } else {
    let total = square.getAttribute("data");
    if (total != 0) {
      square.classList.add("checked");
      square.innerHTML = total;
      return;
    }
    checkSquare(square);
  }
  square.classList.add("checked");
}

// Flag
function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains("checked") && flags < bombAmount) {
    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      square.innerHTML = "🚩";
      flags++;
    } else {
      square.classList.remove("flag");
      square.innerHTML = "";
      flags--;
    }
    flagLeft.innerHTML = "Flags left: " + (bombAmount - flags); // exact wording
  }
}
