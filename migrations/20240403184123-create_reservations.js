'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.createTable('Reservations', { id: Sequelize.INTEGER, restaurant: Sequelize.STRING, eaters: Sequelize.STRING, time: Sequelize.STRING, tableSize: Sequelize.INTEGER });
    await queryInterface.createTable('Reservations', { id: Sequelize.INTEGER, restaurant: Sequelize.STRING, eaters: Sequelize.STRING, time: Sequelize.STRING, tableSize: Sequelize.INTEGER });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Reservations');
  }
};
