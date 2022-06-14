const { Client } = require('pg')
const dotenv =require("dotenv");
dotenv.config({path:'./.env'});

const conn = new Client({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  database : process.env.RDS_DATABASE,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_POST
});

// conn.end();
module.exports = {conn}