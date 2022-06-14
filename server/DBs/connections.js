const { hashPassword } = require('../Controllers/hashed');
const { conn } = require('./db');

conn.connect(function (err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

const createFunction = async (createTableQuery) => {
  try {
    await conn.query(createTableQuery);

  } catch (e) {
    console.log('error: ', e);
  }

}
const findFunction = async (findQuery) => {
  try {
    var data = await conn.query(findQuery);
    return data.rows;
  } catch (e) {
    console.log('error occured while finding table, ', e);
    return null;
  }

}

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
	    id uuid DEFAULT uuid_generate_v4(),
	    name TEXT NOT NULL,
	    email TEXT NOT NULL,
      gender TEXT NOT NULL,
      dob DATE,
      phone BIGINT NOT NULL CHECK (phone> 0),
      password TEXT NOT NULL,
      profile_picture TEXT ,
      signup_medium TEXT DEFAULT 'inapp',
	    PRIMARY KEY (id),
      CONSTRAINT email_unique UNIQUE (email),
      CONSTRAINT phone_unique UNIQUE (phone)
    );`;

const checkUsersExists = `SELECT * FROM users`;

const createArtsTable = `
    CREATE TABLE IF NOT EXISTS arts (
	    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	    art_work TEXT NOT NULL,
      caption TEXT NOT NULL,
      description TEXT,
	    uploaded_by uuid NOT NULL,
      uploaded_on TIMESTAMPTZ NOT NULL,
      CONSTRAINT fk_uploaded_by
        FOREIGN KEY(uploaded_by) 
	        REFERENCES users(id)
	        ON DELETE CASCADE
    );`;

const checkArtsExists = `SELECT * FROM arts`;

const createCommentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
	    id uuid DEFAULT uuid_generate_v4(),
	    art_id uuid NOT NULL,
	    comment TEXT,
      comment_by uuid NOT NULL,
      commented_on TEXT NOT NULL,
	    PRIMARY KEY (id),
      CONSTRAINT fk_art_id
        FOREIGN KEY(art_id) 
	        REFERENCES arts(id)
	        ON DELETE CASCADE,
      CONSTRAINT fk_comment_by
      FOREIGN KEY(comment_by) 
        REFERENCES users(id)
        ON DELETE CASCADE
    );`;

const checkCommentsExists = `SELECT * FROM comments`;

const createlikesAndRatingsTable = `
    CREATE TABLE IF NOT EXISTS likes_ratings (
	    id uuid DEFAULT uuid_generate_v4(),
	    art_id uuid NOT NULL,
      user_id uuid NOT NULL,
      like_status BOOLEAN DEFAULT FALSE,
      ratings INTEGER DEFAULT 0 CHECK (ratings>= 0),
      date TEXT NOT NULL,
	    PRIMARY KEY (id),
      CONSTRAINT fk_art_id
      FOREIGN KEY(art_id) 
      REFERENCES arts(id)
      ON DELETE CASCADE,
      CONSTRAINT fk_user_id
      FOREIGN KEY(user_id) 
      REFERENCES users(id)
      ON DELETE CASCADE
      );`;

const checkLikesRatingsExists = `SELECT * FROM likes_ratings`;

findFunction(checkUsersExists).then(data => {
  if (data !== null) {
  } else {
    createFunction(createUserTable);
  }
}).catch(reject => {
  console.log(reject);
})

findFunction(checkArtsExists).then(data => {
  if (data !== null) {
  } else {
    createFunction(createArtsTable);
  }
}).catch(reject => {
  console.log(reject);
});

findFunction(checkCommentsExists).then(data => {
  if (data !== null) {
  } else {
    createFunction(createCommentsTable);
  }
}).catch(reject => {
  console.log(reject);
});

findFunction(checkLikesRatingsExists).then(data => {
  if (data !== null) {
  } else {
    createFunction(createlikesAndRatingsTable);
  }
}).catch(reject => {
  console.log(reject);
});


const insertFunction = async () => {

  try {
    const password = (await hashPassword("Nicks@10"));
    const insertSuperUser = `insert into users (name, email, gender, dob, phone, password) values ('Nikita Nandani', 'nikita@bdec.in','female', '1996-01-25', '6202878654', '${password}' );`

    await conn.query(insertSuperUser, (err) => {
      if (!err) {
        return 'Inserted'
      } else {
        console.log('error occured: ', err);
      }
    });

  } catch (e) {
    console.log('error: ', e);
    return null;
  }

}
findFunction(checkUsersExists).then(data => {
  if (data !== null) {
    if (data.length === 0) {
      insertFunction().then((result, err) => {
        if (result) {
        }
        if (err) {
          console.log("err", err);
        }
      });
    }
  }
}).catch(reject => {
  console.log(reject);
})
