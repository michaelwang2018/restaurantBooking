'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Eaters', [{
        name: 'John Doe',
        restrictions:'Gluten-Free, Vegetarian, Paleo;Vegan'
    }, {
        name: 'Jane Smith',
        restrictions:'Gluten-Free, Vegetarian, Paleo, Vegan'
    },
    {
        name: 'Scott',
        restrictions:''
    },
    {
        name: 'George',
        restrictions:'Vegan'
    },
    {
        name: 'Elise', 
        restrictions:'Vegetarian'
    },
    {
        name: 'Jess',
        restrictions:'Dog-Friendly'
    },
    {
        name: 'Birju',
        restrictions:''
    },
    {
        name: 'Rachel',
        restrictions:''
    }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Eaters', null, {});
  }
};
