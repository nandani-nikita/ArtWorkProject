const {hashPassword} = require('../Controllers/hashed');
const { conn } = require('./db');

conn.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

// const createFunction = async (createTableQuery) => {
//   try {
//     console.log('creating table');
//     await conn.query(createTableQuery);
//     console.log('Table Created');
//     // return 'Table Created'

//   } catch (e) {
//     console.log('error: ', e);
//     // return null;
//   }

// }
// const findFunction = async (findQuery) => {
//   try {
//     var data = await conn.query(findQuery);
//     console.log('Table exists', data.rows);
//     // console.log('finding', data.rows);
//     return data.rows;
//   } catch (e) {
//     console.log('error occured while finding table');
//     // console.log(e);
//     return null;
//   }

// }


// const createUserTable = `
//     CREATE TABLE IF NOT EXISTS users (
// 	    id uuid DEFAULT uuid_generate_v4(),
// 	    name TEXT NOT NULL,
// 	    email TEXT NOT NULL,
//       dob DATE NOT NULL,
//       phone BIGINT NOT NULL CHECK (phone> 0),
//       password TEXT NOT NULL,
//       profile_picture TEXT ,
//       signup_medium TEXT DEFAULT 'inapp',
// 	    PRIMARY KEY (id),
//       CONSTRAINT email_unique UNIQUE (email),
//       CONSTRAINT phone_unique UNIQUE (phone)
//     );`;

// const checkUsersExists = `SELECT * FROM users`;

// const createArtsTable = `
//     CREATE TABLE IF NOT EXISTS arts (
// 	    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
// 	    art_work TEXT NOT NULL,
//       caption TEXT NOT NULL,
//       description TEXT,
// 	    uploaded_by uuid NOT NULL,
//       uploaded_on TEXT NOT NULL,
//       likes_count INTEGER DEFAULT 0 CHECK (likes_count>= 0),
//       comments_count INTEGER DEFAULT 0 CHECK (comments_count>= 0),
// 	    average_ratings FLOAT(2) DEFAULT 0 CHECK (average_ratings>= 0),
//       CONSTRAINT fk_uploaded_by
//         FOREIGN KEY(uploaded_by) 
// 	        REFERENCES users(id)
// 	        ON DELETE CASCADE
//     );`;

// const checkArtsExists = `SELECT * FROM arts`;

// const createCommentsTable = `
//     CREATE TABLE IF NOT EXISTS comments (
// 	    id uuid DEFAULT uuid_generate_v4(),
// 	    art_id uuid NOT NULL,
// 	    comment TEXT NOT NULL,
//       is_liked BOOLEAN NOT NULL,
//       ratings INTEGER NOT NULL,
//       comment_by uuid NOT NULL,
//       commented_on TEXT NOT NULL,
// 	    PRIMARY KEY (id),
//       CONSTRAINT fk_art_id
//         FOREIGN KEY(art_id) 
// 	        REFERENCES arts(id)
// 	        ON DELETE CASCADE,
//       CONSTRAINT fk_comment_by
//       FOREIGN KEY(comment_by) 
//         REFERENCES users(id)
//         ON DELETE CASCADE
//     );`;

// const checkCommentsExists = `SELECT * FROM comments`;


// findFunction(checkUsersExists).then(data => {
//   console.log(data);
//   if (data !== null) {
//     console.log('users Table exists');
//   } else {
//     console.log('Creating Table...users');
//     createFunction(createUserTable);
//   }
// }).catch(reject => {
//   console.log('Rejected');
//   console.log(reject);
// })

// findFunction(checkArtsExists).then(data => {
//   console.log(data);
//   if (data !== null) {
//     console.log('Arts Table exists');
//   } else {
//     console.log('Creating Table...arts');
//     createFunction(createArtsTable);
//   }
// }).catch(reject => {
//   console.log('Rejected');
//   console.log(reject);
// });

// findFunction(checkCommentsExists).then(data => {
//   console.log(data);
//   if (data !== null) {
//     console.log('Comments Table exists');
//   } else {
//     console.log('Creating Table...comments');
//     createFunction(createCommentsTable);
//   }
// }).catch(reject => {
//   console.log('Rejected');
//   console.log(reject);
// });


// const insertFunction = async () => {

//   try {
//     const password = (await hashPassword("Nicks@10"));
//     console.log(password);
//     const insertSuperUser = `insert into users (name, email, dob, phone, password) values ('Nikita Nandani', 'nikita@bdec.in', '1996-01-25', '6202878654', '${password}' );`

//           await conn.query(insertSuperUser, (err) => {
//               if (!err) {
//                 console.log('data added');
//                 return 'Inserted'
//               } else {
//                   console.log('error occured: ', err);
//               }
//           });

//   } catch (e) {
//       console.log('error: ', e);
//       return null;
//   }

// }
// findFunction(checkUsersExists).then(data => {
//   console.log(data);
//   if (data !== null) {
//     console.log('users Table exists, data: ', data);
//     if(data.length === 0) {
//       insertFunction().then((result,err)=>{
//         if(result) {
//           console.log("result",result);
//         }
//         if(err) {
//           console.log("err",err);
//         }
//       });
//     }
//   } 
// }).catch(reject => {
//   console.log('Rejected');
//   console.log(reject);
// })


// insertFunction()