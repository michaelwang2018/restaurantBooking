'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Assuming Table ID 1 exists; adjust as necessary for your data
    await queryInterface.bulkInsert('Reservations', [{
        restaurant: "Lardo",
        time: new Date(),
        eaters: 'John Doe, Jane Smith',
        tableSize: 2
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};
