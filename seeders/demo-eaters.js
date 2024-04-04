'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Eaters', [{
        id: 1,
        name: 'John Doe',
        restrictions:'Gluten-Free;Vegetarian;Paleo;Vegan'
    }, {
        id: 2,
        name: 'Jane Smith',
        restrictions:'Gluten-Free;Vegetarian;Paleo;Vegan'
    },
    {
        id: 3,
        name: 'Scott',
        restrictions:''
    },
    {
        id: 4,
        name: 'George',
        restrictions:'Vegan'
    },
    {
        id: 5,
        name: 'Elise', 
        restrictions:'Vegetarian'
    }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Eaters', null, {});
  }
};
