const mongoose = require("mongoose");

const LeaderBoardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  trail: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const LeaderBoard = mongoose.model("LeaderBoard", LeaderBoardSchema);

const getAll = async () => await LeaderBoard.find();

const getOneById = async id => await LeaderBoard.findById(id);

const deleteOneById = async id => await LeaderBoard.deleteOne(id);

const updateOneById = async (id, data) =>
  await LeaderBoard.updateOne({ _id: req.params.id }, { $set: data });

const add = async (name, game) => {
  const { curTrail, score } = game;
  const lb = new LeaderBoard({ name, trail: curTrail, score });
  return await lb.save();
};

const prepareData = (list, curUser) => {
  let data = [];
  let player;
  list.sort((a, b) => b.score - a.score);
  list.forEach((d, index) => {
    let newData = {
      Rank: index + 1,
      Player: d.name,
      Trail: d.trail,
      Score: d.score,
      Date: new Date(d.date)
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, "/")
        .replace("T", " ")
    };
    if (index < 5) {
      data.push(newData);
    }
    if (d._id == curUser) {
      player = { ...newData };
    }
  });
  return { data, player };
};

const getTopScores = async userId => {
  const result = await getAll();
  return prepareData(result, userId);
};

module.exports = {
  getAll,
  getOneById,
  deleteOneById,
  updateOneById,
  add,
  getTopScores
};
