'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Assuming Table ID 1 exists; adjust as necessary for your data
    // await queryInterface.bulkInsert('Reservations', [{
    //   restaurantId: 1,
    //   time: new Date(),
    //   eaters:
    // }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};
