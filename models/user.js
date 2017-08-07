'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    telegramId: DataTypes.INTEGER,
    facebookId: DataTypes.INTEGER,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};