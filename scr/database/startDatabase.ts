import * as Sequelize from 'sequelize';
import * as path from 'path';
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

//Create database
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);
