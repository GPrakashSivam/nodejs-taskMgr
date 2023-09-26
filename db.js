// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'your-host',
  username: 'root',
  password: 'yourpass',
  database: 'node-apps-db',
});

module.exports = sequelize;
