const express = require("express");
const routes = express.Router();
const GameController = require("../controllers/gameController");
const leaderBoardController = require("../controllers/leaderBoardController");

// middleware - redirect home if game not found
const redirectHomeIfGameNotExist = (req, res, next) => {
  if (!res.locals.game) {
    res.redirect("/");
  } else {
    next();
  }
};

const redirectHomeIfGameTerminated = (req, res, next) => {
  if (res.locals.game && res.locals.game.terminate) {
    res.redirect("/");
  } else {
    next();
  }
};

//home page
routes.get("/", GameController.showHomePage);

// load game page
routes.get(
  "/game",
  redirectHomeIfGameNotExist,
  redirectHomeIfGameTerminated,
  GameController.showGamePage
);

// summary page
routes.get(
  "/summary",
  redirectHomeIfGameNotExist,
  redirectHomeIfGameTerminated,
  GameController.showSummaryPage
);

// load leader board game
routes.get("/leaderboard", leaderBoardController.showLeaderBoard);
routes.get(
  "/leaderboard/:userId",
  leaderBoardController.showLeaderBoardWithPlayer
);

// create new game
routes.post("/start", GameController.startGame);

// check game status
routes.post(
  "/gameStatus",
  redirectHomeIfGameNotExist,
  redirectHomeIfGameTerminated,
  GameController.checkGameStatus
);

// update animation status
routes.post(
  "/animationStatus",
  redirectHomeIfGameNotExist,
  redirectHomeIfGameTerminated,
  GameController.animationStatus
);

// update animation status
routes.post(
  "/action",
  redirectHomeIfGameNotExist,
  redirectHomeIfGameTerminated,
  GameController.userAction
);

// start next trail
routes.post(
  "/nextTrail",
  redirectHomeIfGameNotExist,
  redirectHomeIfGameTerminated,
  GameController.nextTrail
);

// save score to db
routes.post(
  "/saveGameScore",
  redirectHomeIfGameNotExist,
  leaderBoardController.saveGameScore
);

module.exports = routes;
