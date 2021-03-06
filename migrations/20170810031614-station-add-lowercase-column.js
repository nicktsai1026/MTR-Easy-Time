'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'stations',
        'lowerCaseName',
    {
        type:Sequelize.STRING
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
        'stations',
        'lowerCaseName',
    {
        type:Sequelize.STRING
    })
  }
};
