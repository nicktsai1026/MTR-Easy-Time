'use strict';
module.exports = function(sequelize, DataTypes) {
  var line_station = sequelize.define('line_station', {
    lineId: DataTypes.INTEGER,
    stationId: DataTypes.INTEGER,
    sequel: DataTypes.INTEGER
  });
  line_station.associate =  function(models) {
      line_station.belongsTo(models.line,{sourceKey:"lineId"});
      line_station.belongsTo(models.station,{sourceKey:"stationId"});
  }
  return line_station;
};
