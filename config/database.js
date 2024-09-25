const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const bcrypt = require('bcryptjs');

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
      role TEXT,
      flag_penalty DATETIME
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
      status TEXT DEFAULT 'A',
      FOREIGN KEY (member_code) REFERENCES members (code)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lending_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lending_id INTEGER,
      book_code TEXT,
      status TEXT DEFAULT 'A',
      FOREIGN KEY (lending_id) REFERENCES lendings (id),
      FOREIGN KEY (book_code) REFERENCES books (code)
    )
  `);
  
  
  /**
   * MOCK DATA
   */
  
  // data awal untuk books, jika kosong.
  db.get(`SELECT COUNT(*) as count FROM books`, (err, row) => {
    if (err) {
      console.error("Error checking books table:", err);
    } else if (row.count === 0) {
      const mockBooks = [
          {
            code: "JK-45",
            title: "Harry Potter",
            author: "J.K Rowling",
            stock: 1
          },
          {
              code: "SHR-1",
              title: "A Study in Scarlet",
              author: "Arthur Conan Doyle",
              stock: 1
          },
          {
              code: "TW-11",
              title: "Twilight",
              author: "Stephenie Meyer",
              stock: 1
          },
          {
              code: "HOB-83",
              title: "The Hobbit, or There and Back Again",
              author: "J.R.R. Tolkien",
              stock: 1
          },
          {
              code: "NRN-7",
              title: "The Lion, the Witch and the Wardrobe",
              author: "C.S. Lewis",
              stock: 1
          }
      ];
  
      const stmt = db.prepare(`INSERT INTO books (code, title, author, stock) VALUES (?, ?, ?, ?)`);
      mockBooks.forEach(book => {
        stmt.run(book.code, book.title, book.author, book.stock);
      });
      stmt.finalize();
  
      console.log("seeding books berhasil.");
    } else {
      console.log("books seeding rejected.");
    }
  });
  
  // data awal untuk members, jika kosong.
  db.get(`SELECT COUNT(*) as count FROM members`, async (err, row) => {
    if (err) {
      console.error("Error checking members table:", err);
    } else if (row.count === 0) {
    
      const password = "pass123";
      const hashedPassword = await bcrypt.hash(password, 10);

      /**
       * pass default = pass123
       */
      const mockMembers = [
        {
          code: "sdenni",
          name: "Denni Septiyaji",
          password: hashedPassword, 
          role: 'admin'
        },
        {
          code: "M001",
          name: "Angga",
          password: hashedPassword, 
          role: 'member'
        },
        {
            code: "M002",
            name: "Ferry",
            password: hashedPassword, 
            role: 'member'
        },
        {
            code: "M003",
            name: "Putri",
            password: hashedPassword, 
            role: 'member'
        }
      ];
  
      const stmt = db.prepare(`INSERT INTO members (code, name, password, role) VALUES (?, ?, ?, ?)`);
      mockMembers.forEach(member => {
        stmt.run(member.code, member.name, member.password, member.role);
      });
      stmt.finalize();
  
      console.log("seeding members berhasil. default pass = `pass123` | utk admin gunakan user/code : sdenni");
    } else {
      console.log("books seeding rejected. default pass = `pass123` | utk admin gunakan user/code : sdenni");
    }
  });
  
})



module.exports = db;