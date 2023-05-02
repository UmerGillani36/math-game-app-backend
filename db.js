const sqlite3 = require('sqlite3').verbose();

// open the database
const db = new sqlite3.Database('mydb.sqlite');

// create the users table if it doesn't exist
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);
    db.run('CREATE TABLE IF NOT EXISTS leaderboard (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, email TEXT NOT NULL, created_at INTEGER NOT NULL)');
});

// export the database connection
module.exports = db;