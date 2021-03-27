'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
// console.log(env, config)

//config.host = 'pqsql'

//console.log(process.env.CONNECTION_STRING)

if(config.url) {
  sequelize = new Sequelize(config.url, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }, 
      }
    }
  );
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else { 
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
