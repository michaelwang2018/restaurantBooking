'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Assuming Table ID 1 exists; adjust as necessary for your data
    await queryInterface.bulkInsert('Reservations', [{
        restaurant: "Lardo",
        time: new Date('April 12, 2024 17:00:00'),
        eaters: 'John Doe, Jane Smith',
        tableSize: 2,
        createdAt: new Date(),
        updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};
