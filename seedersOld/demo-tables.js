'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Assuming Restaurant ID 1 and 2 exist; adjust as necessary for your data
    await queryInterface.bulkInsert('Tables', [{
      capacity: 4,
      restaurantId: 1, // Adjust based on actual Restaurant IDs in your database
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      capacity: 2,
      restaurantId: 2, // Adjust based on actual Restaurant IDs in your database
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tables', null, {});
  }
};
