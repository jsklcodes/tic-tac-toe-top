// factory to create player objects
const Player = (name, symbol) => ({ name, symbol });

// module to create the game board
const Gameboard = (() => {
  const gameboard = Array(9).fill('');

  const getGameboard = () => gameboard;

  const isGameboardFull = () => gameboard.every(square => square !== '');

  const canCheckVictory = () =>
    gameboard.filter(symbol => symbol === 'X').length >= 3;

  const fillSquare = (position, symbol) => {
    if (gameboard[position] !== '') {
      throw new Error(`The position ${position} is already marked. Try again.`);
    }
    gameboard[position] = symbol;
  };

  return { getGameboard, isGameboardFull, canCheckVictory, fillSquare };
})();

// module to control the game flow
const Game = (() => {
  const players = [Player('Linus', 'X'), Player('Emily', 'O')];
  let currentPlayer = players[0];

  const getPlayers = () => players;

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
    getPlayers,
    getCurrentPlayer,
    switchCurrentPlayer,
    makeMove,
    hasVictory,
    hasDraw,
  };
})();

// module to control the DOM manipulation/event listeners
const DOM = (() => {
  const init = () => {
    console.log('Initializing app...');
    addCurrentPlayerIndicator();
    renderPlayers();
    renderGameboard();
    listenGameboardClicks();
  };

  const createPlayerDivs = () => {
    const players = Game.getPlayers();
    const playerDivs = players
      .map(
        player => `
      <div class="player" data-symbol="${player.symbol}">
        <span class="player__name">${player.name}</span>
        <span class="player__symbol">(${player.symbol})</span>
      </div>
      `
      )
      .join('');

    return playerDivs;
  };

  const renderPlayers = () => {
    const playersDiv = document.querySelector('#players');
    playersDiv.insertAdjacentHTML('afterbegin', createPlayerDivs());
  };

  const createGameboardSquares = () => {
    const gameboard = Gameboard.getGameboard();
    const squares = gameboard
      .map(
        (symbol, index) =>
          `<div class="square" data-index="${index}" data-symbol="${symbol}">${symbol}</div>`
      )
      .join('');

    return squares;
  };

  const renderGameboard = () => {
    const gameboardDiv = document.querySelector('#gameboard');
    gameboardDiv.insertAdjacentHTML('afterbegin', createGameboardSquares());
  };

  const addCurrentPlayerIndicator = () => {
    document.body.dataset.currentPlayer = Game.getCurrentPlayer().symbol;
  };

  const toggleCurrentPlayerIndicator = () => {
    const body = document.body;
    const { currentPlayer } = body.dataset;
    const playersToggle = { X: 'O', O: 'X' };

    body.dataset.currentPlayer = playersToggle[currentPlayer];
  };

  const renderVictoryMessage = (targetElement, currentPlayer) => {
    targetElement.textContent = `Congratulations, ${currentPlayer.name} (${currentPlayer.symbol})! You have won the game!`;
  };

  const renderDrawMessage = targetElement => {
    targetElement.textContent = `It's a draw! Well played both!`;
  };

  const renderGameResult = () => {
    const { hasVictory, hasDraw, getCurrentPlayer } = Game;
    const gameResultP = document.querySelector('#game-result');

    if (hasVictory()) {
      renderVictoryMessage(gameResultP, getCurrentPlayer());
    }

    if (hasDraw()) {
      renderDrawMessage(gameResultP);
    }
  };

  const checkVictoryOrDraw = () => {
    const { hasVictory, hasDraw, switchCurrentPlayer } = Game;

    if (hasVictory() || hasDraw()) {
      const gameboardDiv = document.querySelector('#gameboard');
      gameboardDiv.removeEventListener('click', handleGameboardClicks);
      toggleCurrentPlayerIndicator();
      switchCurrentPlayer();
    }

    renderGameResult();
  };

  const handleGameboardClicks = event => {
    const clickedSquare = event.target;
    const squarePosition = clickedSquare.dataset.index;
    const { makeMove, getCurrentPlayer, switchCurrentPlayer } = Game;
    const { canCheckVictory } = Gameboard;

    makeMove(squarePosition);
    clickedSquare.textContent = getCurrentPlayer().symbol;
    switchCurrentPlayer();
    toggleCurrentPlayerIndicator();

    if (canCheckVictory()) {
      checkVictoryOrDraw();
    }
  };

  const listenGameboardClicks = () => {
    const gameboardDiv = document.querySelector('#gameboard');
    gameboardDiv.addEventListener('click', handleGameboardClicks);
  };

  return { init };
})();

DOM.init();
