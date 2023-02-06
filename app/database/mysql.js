const { Sequelize } = require('sequelize')

const db = new Sequelize('consul', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
}); 

module.exports = db