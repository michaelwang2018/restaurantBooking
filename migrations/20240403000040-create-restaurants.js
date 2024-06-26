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
    await queryInterface.createTable('Restaurants', { id: Sequelize.INTEGER, name: Sequelize.STRING, endorsements: Sequelize.STRING, two_top: Sequelize.INTEGER, four_top: Sequelize.INTEGER, six_top: Sequelize.INTEGER, createdAt: Sequelize.STRING, updatedAt: Sequelize.STRING});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Restaurants');
  }
};
