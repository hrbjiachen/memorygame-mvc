const leaderBoardData = require("../models/leaderBoardData");
const gameData = require("../models/gameData");

const saveGameScore = async (req, res) => {
  const { game } = res.locals;
  const { name } = req.body;
  try {
    const result = await leaderBoardData.add(name, game);
    gameData.removeGame(game.gameId);
    res.status(200).send({ userId: result._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

const showLeaderBoard = async (req, res) => {
  const { game } = res.locals;
  const { data } = await leaderBoardData.getTopScores(game);
  res.render("leaderBoard", {
    pageTitle: "Leader Board",
    data,
    leaderBoardCSS: true
  });
};

const showLeaderBoardWithPlayer = async (req, res) => {
  const userId = req.params.userId;
  const { data, player } = await leaderBoardData.getTopScores(userId);
  res.render("leaderBoard", {
    pageTitle: "Leader Board",
    data,
    player,
    leaderBoardCSS: true
  });
};

module.exports = {
  saveGameScore,
  showLeaderBoard,
  showLeaderBoardWithPlayer
};
