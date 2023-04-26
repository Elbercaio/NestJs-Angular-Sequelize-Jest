'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },

      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },

      email: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },

      cpf: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(11),
        unique: true,
      },

      password: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },

      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
      },

      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
      },

      deletedAt: {
        field: 'deleted_at',
        allowNull: true,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
