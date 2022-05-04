"use strict";

// #########################################################
//* DOM VARIABLES
// #########################################################
const rows = document.querySelectorAll(".row");
const row0 = document.querySelectorAll(".row--0");
const row1 = document.querySelectorAll(".row--1");
const row2 = document.querySelectorAll(".row--2");
const col0 = document.querySelectorAll(".box--0");
const col1 = document.querySelectorAll(".box--1");
const col2 = document.querySelectorAll(".box--2");
const diag0 = document.querySelectorAll(".diag--0");
const diag1 = document.querySelectorAll(".diag--1");
const boxes = document.querySelectorAll(".box");
const modalText = document.querySelector("#modal-text");
const modal = document.querySelector(".modal__wrapper");
const btnStart = document.querySelector("#new-game");

// #########################################################
//* BOARD AND PLAYER VARIABLES
// #########################################################
let board, players, activePlayer;

// #########################################################
//* GAME PLAY LOGIC
// #########################################################
// Winning Conditions
// const winRow = function (playerMark, rowNum) {
//   return board[rowNum].every((square) => square === playerMark);
// };

const winRow0 = function (playerMark) {
  return board[0].every((square) => square === playerMark);
};
const winRow1 = function (playerMark) {
  return board[1].every((square) => square === playerMark);
};
const winRow2 = function (playerMark) {
  return board[2].every((square) => square === playerMark);
};

const winCol0 = function (playerMark) {
  return (
    (board[0][0] === playerMark && board[1][0]) === playerMark &&
    board[2][0] == playerMark
  );
};
const winCol1 = function (playerMark) {
  return (
    (board[0][1] === playerMark && board[1][1]) === playerMark &&
    board[2][1] == playerMark
  );
};
const winCol2 = function (playerMark) {
  return (
    (board[0][2] === playerMark && board[1][2]) === playerMark &&
    board[2][2] == playerMark
  );
};
const winDiag0 = function (playerMark) {
  return (
    (board[0][0] === playerMark && board[1][1]) === playerMark &&
    board[2][2] == playerMark
  );
};
const winDiag1 = function (playerMark) {
  return (
    (board[0][2] === playerMark && board[1][1]) === playerMark &&
    board[2][0] == playerMark
  );
};

// Check win conditions
const winConditions = function (playerMark) {
  let winner = "none";

  // Horizontal
  // for (let i = 0; i < 3; i++) {
  //   if (winRow(playerMark, i)) winner = playerMark;
  // }
  if (winRow0(playerMark)) winner = playerMark;
  if (winRow1(playerMark)) winner = playerMark;
  if (winRow2(playerMark)) winner = playerMark;

  // Vertical
  if (winCol0(playerMark)) winner = playerMark;
  if (winCol1(playerMark)) winner = playerMark;
  if (winCol2(playerMark)) winner = playerMark;

  // Diagonal
  if (winDiag0(playerMark)) winner = playerMark;
  if (winDiag1(playerMark)) winner = playerMark;

  return winner;
};

const changePlayer = function () {
  activePlayer === players.playerX
    ? (activePlayer = players.playerO)
    : (activePlayer = players.playerX);
};

// Start New Game
const newGame = function () {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  players = {
    playerX: {
      input: [],
      mark: "X"
    },

    playerO: {
      input: [],
      mark: "O"
    }
  };

  activePlayer = players.playerX;
};

//
const compChooseBox = function () {
  const randomBoxRow = Math.floor(Math.random() * 3);
  const randomBoxCol = Math.floor(Math.random() * 3);
  return [randomBoxRow, randomBoxCol];
};

// #########################################################
//* VISUAL LOGIC
// #########################################################
const updateUI = function () {
  for (let i = 0; i < board.length; i++) {
    // Loop over each row of board
    board[i].forEach((box, j) => {
      const boxDOM = document.querySelector(`#box${j + i * 3}`);
      boxDOM.textContent = box;

      // Remove any marked classes to ensure no overlapping font colors
      boxDOM.classList.remove("box--x");
      boxDOM.classList.remove("box--o");

      // Add font color to distinguish "x" and "o"
      boxDOM.textContent === "X"
        ? boxDOM.classList.add("box--x")
        : boxDOM.classList.add("box--o");
    });
  }
};

const hideModal = function () {
  modal.classList.add("fade-out");
  setTimeout(() => modal.classList.add("hide-behind"), 1000);
};

const showModal = function (winner) {
  modalText.textContent = `${winner} wins!`;
  modal.classList.remove("hide-behind");
  modal.classList.remove("fade-out");
};

const resetBoxColors = function () {
  boxes.forEach((box) => box.classList.remove("box--win"));
};

const clearMarks = function () {
  boxes.forEach((box) => (box.textContent = ""));
};

const winConditionVisual = function (playerMark) {
  if (winRow0(playerMark)) row0.forEach((box) => box.classList.add("box--win"));
  if (winRow1(playerMark)) row1.forEach((box) => box.classList.add("box--win"));
  if (winRow2(playerMark)) row2.forEach((box) => box.classList.add("box--win"));
  if (winCol0(playerMark)) col0.forEach((box) => box.classList.add("box--win"));
  if (winCol1(playerMark)) col1.forEach((box) => box.classList.add("box--win"));
  if (winCol2(playerMark)) col2.forEach((box) => box.classList.add("box--win"));
  if (winDiag0(playerMark))
    diag0.forEach((box) => box.classList.add("box--win"));
  if (winDiag1(playerMark))
    diag1.forEach((box) => box.classList.add("box--win"));
};

// #########################################################
//* GAME PLAY INTERFACE INTERACTION
// #########################################################
boxes.forEach((box) => {
  box.addEventListener("click", (e) => {
    // Get coordinates of chosen box
    const coords =
      e.target.classList[1].slice(-1) + e.target.classList[2].slice(-1);

    // Disallow play on marked boxes
    if (board[coords[0]][coords[1]] !== "") return;

    // Add turn to individual player input array
    activePlayer.input.push(coords);

    // Add player input to board array
    board[coords[0]][coords[1]] = activePlayer.mark;

    // Update visual
    updateUI();

    // Check win conditions
    const winner = winConditions(activePlayer.mark);

    // Update visual to represent winning combo
    winConditionVisual(activePlayer.mark);

    if (winner !== "none") {
      showModal(winner);
      return;
    }

    if (board.flat().every((box) => box !== "")) {
      showModal("No one");
      return;
    }

    // Change player turn
    changePlayer();

    // ################ Computer turn

    // Call math.Random for all 9 squares
    let compChoice = compChooseBox();

    // if chosen random square is filled, math.random()
    while (board[compChoice[0]][compChoice[1]] !== "") {
      compChoice = compChooseBox();
    }
    // Add to player choices arr in object
    activePlayer.input.push(compChoice);

    // Add to board arr
    board[compChoice[0]][compChoice[1]] = activePlayer.mark;

    // update visual to include
    updateUI();

    // Check win conditions
    const winner1 = winConditions(activePlayer.mark);

    // Update visual to represent winning combo
    winConditionVisual(activePlayer.mark);

    if (winner1 !== "none") {
      showModal(winner1);
    }

    // at the end, call changeplayer
    changePlayer();
  });
});

btnStart.addEventListener("click", () => {
  newGame();
  hideModal();
  resetBoxColors();
  clearMarks();
});
