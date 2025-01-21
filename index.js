// factory to create player objects
const Player = (name, symbol) => ({ name, symbol });

// module to create the game board
const Gameboard = (() => {
  const gameboard = Array(9).fill('');

  const getGameboard = () => gameboard;

  const isGameboardFull = () => gameboard.every(square => square !== '');

  const fillSquare = (position, symbol) => {
    if (gameboard[position] !== '') {
      throw new Error(`The position ${position} is already marked. Try again.`);
    }
    gameboard[position] = symbol;
  };

  return { getGameboard, isGameboardFull, fillSquare };
})();

// module to control the game flow
const Game = (() => {
  const players = [Player('Linus', 'X'), Player('Emily', 'O')];
  let currentPlayer = players[0];

  const getCurrentPlayer = () => currentPlayer;

  const switchCurrentPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const hasVictory = () => {
    const gameboard = Gameboard.getGameboard();
    const victoryCombo = [
      // rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < victoryCombo.length; i++) {
      const [a, b, c] = victoryCombo[i];
      if (
        gameboard[a] &&
        gameboard[a] === gameboard[b] &&
        gameboard[a] === gameboard[c]
      ) {
        return true;
      }
    }
    return false;
  };

  const hasDraw = () => {
    const { isGameboardFull } = Gameboard;
    return !hasVictory() && isGameboardFull();
  };

  const makeMove = position => {
    try {
      Gameboard.fillSquare(position, currentPlayer.symbol);
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    getCurrentPlayer,
    switchCurrentPlayer,
    makeMove,
    hasVictory,
    hasDraw,
  };
})();
