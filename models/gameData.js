const gameUtil = require("../util/gameUtil");

let data = [];

const addNewGame = gameId => {
  const defaultOptions = [5, 5, 3];
  let newTrail = {
    initAnimationRequired: true,
    options: defaultOptions,
    board: gameUtil.generateBoard(defaultOptions),
    actions: []
  };

  data.push({
    gameId,
    curTrail: 0,
    score: 0,
    terminate: false,
    tile: defaultOptions[2],
    trails: [newTrail]
  });
};

const removeGame = gameId => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].gameId === gameId) {
      console.log("Game removed", gameId);
      data.splice(i, 1);
    }
  }
};

const getGameById = gameId => data.find(d => d.gameId === gameId);

const updateAnimationStatus = (game, status) => {
  const { curTrail, trails } = game;
  trails[curTrail].initAnimationRequired = status;
};

const updateScore = (game, correct) => {
  game.score += correct ? 1 : -1;
  return game.score;
};

const updateAction = (game, action) => {
  const { curTrail, trails } = game;
  trails[curTrail].actions.push(action);
  return trails[curTrail].actions;
};

const prepareNextTrail = game => {
  const { trails, curTrail } = game;
  const prevTrail = trails[curTrail];
  const isError = prevTrail.actions.some(a => !a.success);

  const newOptions = gameUtil.updateTrailOption(prevTrail.options, isError);
  game.curTrail += 1;
  game.tile = newOptions[2];
  let newTrail = {
    initAnimationRequired: true,
    board: gameUtil.generateBoard(newOptions),
    options: newOptions,
    actions: []
  };

  game.trails.push(newTrail);

  return game;
};

module.exports = {
  addNewGame,
  removeGame,
  getGameById,
  updateAnimationStatus,
  updateScore,
  updateAction,
  prepareNextTrail
};
