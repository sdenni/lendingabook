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
      name TEXT,
      password TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lendings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_code TEXT,
      borrowed_at DATETIME,
      due_date DATETIME,
      returned_at DATETIME,
      penalty_per_day INTEGER DEFAULT 2000,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (member_code) REFERENCES members (code)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lending_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lending_id INTEGER,
      book_code TEXT,
      FOREIGN KEY (lending_id) REFERENCES lendings (id),
      FOREIGN KEY (book_code) REFERENCES books (code)
    )
  `);
})

module.exports = db;