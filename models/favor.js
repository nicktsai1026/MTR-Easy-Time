'use strict';
module.exports = function(sequelize, DataTypes) {
  var favor = sequelize.define('favor', {
    facebookId: DataTypes.STRING,
    remark: DataTypes.STRING,
    stationName: DataTypes.STRING,
    userId:DataTypes.INTEGER
  });
  favor.associate =  function(models) {
      favor.belongsTo(models.user,{sourceKey:"facebookId"});
  }
  return favor;
};
