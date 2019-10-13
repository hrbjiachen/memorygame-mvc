const gameData = require("../models/gameData");
const { uuidv4 } = require("../util/commonUtil");
const responseMessage = require("../util/responseMessage");

const showHomePage = (req, res) => {
  const { gameId } = req.session;
  if (gameId) {
    req.session.gameId = null;
    gameData.removeGame(gameId);
  }

  res.render("home", { pageTitle: "Home Page", homeCSS: true });
};

const showGamePage = (req, res) => {
  const { game } = res.locals;
  const { score, curTrail, tile, trails } = game;

  const { board, initAnimationRequired } = trails[curTrail];
  res.render("gameBoard", {
    pageTitle: "Memory Game",
    score,
    curTrail: curTrail + 1,
    tile,
    board,
    initAnimationRequired,
    gameBoardCSS: true
  });
};

const showSummaryPage = (req, res) => {
  const { game } = res.locals;
  const { score, curTrail } = game;

  game.terminate = true;

  res.render("summary", {
    pageTitle: "Game Summary",
    score,
    curTrail: curTrail + 1,
    summaryCSS: true
  });
};

const startGame = (req, res) => {
  const gameId = uuidv4();
  gameData.addNewGame(gameId);
  req.session.gameId = gameId;
  return res.redirect("/game");
};

const checkGameStatus = (req, res) => {
  const { game } = res.locals;
  const { curTrail, trails } = game;
  const { initAnimationRequired, actions } = trails[curTrail];
  res.status(200).send({ initAnimationRequired, actions });
};

const animationStatus = (req, res) => {
  const { initAnimationRequired } = req.body;
  const { game } = res.locals;
  gameData.updateAnimationStatus(game, initAnimationRequired);
  res
    .status(200)
    .send({ message: responseMessage.ANIMATION_STATUS_UPDATE_SUCCESS });
};

const userAction = (req, res) => {
  const { row, col } = req.body;
  const { game } = res.locals;
  const { curTrail, trails, tile, score } = game;
  const { board } = trails[curTrail];

  const success = board[row][col];

  if (!success && score === 0) {
    game.terminate = true;
    res.status(200).send({ status: responseMessage.GAME_END });
  } else {
    const newScore = gameData.updateScore(game, success);
    const actions = gameData.updateAction(game, { row, col, success });
    const clickLeft = tile - actions.length;
    const isError = actions.some(a => !a.success);
    res.status(200).send({ success, newScore, clickLeft, isError });
  }
};

const nextTrail = (req, res) => {
  const { game } = res.locals;
  gameData.prepareNextTrail(game);
  res.status(200).send({ message: responseMessage.SUCCESS });
};

module.exports = {
  showHomePage,
  showGamePage,
  showSummaryPage,
  startGame,
  checkGameStatus,
  animationStatus,
  userAction,
  nextTrail
};
