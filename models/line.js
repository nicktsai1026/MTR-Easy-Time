'use strict';
module.exports = function(sequelize, DataTypes) {
  var line = sequelize.define('line', {
    chinese: DataTypes.STRING,
    english: DataTypes.STRING,
    linesAbbreviation: DataTypes.STRING
  });
  line.associate =  function(models) {
      line.hasMany(models.line_station,{targetKey:"lineId"});
  }
  return line;
};
