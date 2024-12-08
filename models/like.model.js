let { sequelize, DataTypes } = require("../lib/index");
let { movieModel } = require("../models/movie.model");
let { userModel } = require("../models/user.model");
let likeModel = sequelize.define("likes", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: userModel,
      key: "id",
    },
    allowNull: false,
  },
  movieId: {
    type: DataTypes.INTEGER,
    references: {
      model: movieModel,
      key: "id",
    },
    allowNull: false,
  },
});

userModel.belongsToMany(movieModel, { through: likeModel });
movieModel.belongsToMany(userModel, { through: likeModel });

module.exports = { likeModel };
