const { Client } = require('pg')
const dotenv =require("dotenv");
dotenv.config({path:'./.env'});

const connection = new Client({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  database : process.env.RDS_DATABASE,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_POST
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

// connection.end();

module.exports = {connection}