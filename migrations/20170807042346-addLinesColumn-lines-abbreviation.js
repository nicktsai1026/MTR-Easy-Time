
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'lines',
      'linesAbbreviation',
      {
        type: Sequelize.STRING
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'lines',
      'linesAbbreviation',
      {
        type: Sequelize.STRING
      })
  }
};
