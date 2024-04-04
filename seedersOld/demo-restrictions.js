'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.bulkInsert('Restrictions', [{
        //     name: 'Gluten-Free'
        // }, {
        //     name: 'Vegetarian'
        // }, {
        //     name: 'Paleo'
        // }, {
        //     name: 'Vegan'
        // }]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Restaurants', null, {});
    }
};
