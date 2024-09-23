const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../lenddb.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if(err) {
    console.log("gagal konek", err);
  } else {
    console.log("success connected");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      title TEXT,
      author TEXT,
      stock INTEGER
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      name TEXT
    )
  `);
})

module.exports = db;