/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use strict';

module.exports = {
  up: (queryInterface, _Sequelize) =>
    queryInterface.bulkInsert('users', [
      {
        name: 'Roberto',
        email: 'robertinho_totoso@gmail.com',
        password: '$2b$10$Ouq0nnxtmTfB9KgbQxr8Ge0PKBcFrdFoSa3YMOB/Mz22ogkvEgh7u',
        cpf: '62217678060',
      },
    ]),

  down: (queryInterface, _Sequelize) => queryInterface.bulkDelete('users', null, {}),
};
