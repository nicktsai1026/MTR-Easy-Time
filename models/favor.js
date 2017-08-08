'use strict';
module.exports = function(sequelize, DataTypes) {
  var favor = sequelize.define('favor', {
    facebookId: DataTypes.STRING,
    remark: DataTypes.STRING,
    stationId: DataTypes.INTEGER
  });
  favor.associate =  function(models) {
      favor.belongsTo(models.station,{sourceKey:"stationId"});
      favor.belongsTo(models.user,{sourceKey:"facebookId"});
  }
  return favor;
};
