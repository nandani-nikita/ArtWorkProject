const {connection} = require('./db');
const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// // var query = `INSERT INTO accounts (user_id,username,password,email,created_on)
// // VALUES (25,'vghvjbk','ghv',' njbhbkh','2022-05-15')`
// // connection.query(query, (err) => {
// //     console.log(err,"\n\n");
// //   });

// connection.query("SELECT * from accounts", (err, res) => {
//     console.log(err,"\n\n");
//     for (let row in res.rows) {
//         console.log(res.rows[row]);
//     }
//     // connection.end();
//   });