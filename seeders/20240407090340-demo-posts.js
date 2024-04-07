'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Posts', [{
      title: 'First Post',
      content: 'This is the content for the first post.',
      author: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Second Post',
      content: 'This is the content for the second post.',
      author: 'Jane Doe',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Photos', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
