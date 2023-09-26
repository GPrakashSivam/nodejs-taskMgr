// models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Task = sequelize.define('task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('open', 'inprogress', 'completed'),
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Task;
