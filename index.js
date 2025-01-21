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
