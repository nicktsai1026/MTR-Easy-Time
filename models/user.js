'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    telegramId: DataTypes.STRING,
    facebookId: DataTypes.STRING
  });
  user.associate =  function(models) {
      user.hasMany(models.favor,{targetKey:"facebookId"});
  }
  return user;
};
