'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'stations',
        'mtrId',
    {
        type:Sequelize.INTEGER
    }).then(()=>{
        queryInterface.addColumn(
            'stations',
            'mtrShort',
            {
                type:Sequelize.STRING
            });
    });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn(
          'stations',
          'mtrId',
      {
          type:Sequelize.INTEGER
      }).then(()=>{
          queryInterface.removeColumn(
              'stations',
              'mtrShort',
              {
                  type:Sequelize.STRING
              });
      });
  }
};
