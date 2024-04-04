'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Restaurants', [{
        name: 'Lardo',
        endorsements: 'Gluten-Free',
        two_top: 4,
        four_top: 2,
        six_top: 1,
    }, {
        name: 'Panadería Rosetta',
        endorsements: 'Vegetarian;Gluten-Free',
        two_top: 3,
        four_top: 2,
        six_top: 0,
    }, {
        name: 'Tetetlán',
        endorsements: 'Paleo;Gluten-Free',
        two_top: 4,
        four_top: 2,
        six_top: 1,
    }, {
        name: 'Falling Piano Brewing Co',
        endorsements: 'Vegan;Vegetarian',
        two_top: 5,
        four_top: 5,
        six_top: 5,
    }, {
        name: 'u.to.pi.a',
        endorsements: 'Vegan;Vegetarian',
        two_top: 2,
        four_top: 0,
        six_top: 0,
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null, {});
  }
};
