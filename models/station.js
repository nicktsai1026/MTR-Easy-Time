'use strict';
module.exports = function(sequelize, DataTypes) {
  var station = sequelize.define('station', {
    chinese: DataTypes.STRING,
    english: DataTypes.STRING
  });
  station.associate =  function(models) {
      station.hasMany(models.line_station,{targetKey:"stationId"});
  }
  return station;
};
