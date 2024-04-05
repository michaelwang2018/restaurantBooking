'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Eaters', [{
    //     name: 'John Doe',
    //     restrictions:'Gluten-Free, Vegetarian, Paleo, Vegan',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // }, {
    //     name: 'Jane Smith',
    //     restrictions:'Gluten-Free, Vegetarian, Paleo, Vegan',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // },
    // {
    //     name: 'Scott',
    //     restrictions:'',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // },
    // {
    //     name: 'George',
    //     restrictions:'Vegan',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // },
    // {
    //     name: 'Elise', 
    //     restrictions:'Vegetarian',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // },
    // {
    //     name: 'Jess',
    //     restrictions:'Dog-Friendly',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // },
    // {
    //     name: 'Birju',
    //     restrictions:'',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // },
    // {
    //     name: 'Rachel',
    //     restrictions:'',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    // }
    // ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Eaters', null, {});
  }
};
