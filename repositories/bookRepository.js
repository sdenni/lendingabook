const db = require('../config/database');

class BookRepository {
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM books', [], (err, rows) => {
        if(err) reject(err);
        resolve(rows);
      })
    })
  }
  
  static create(book) {
    return new Promise((resolve, reject) => {
      const { code, title, author, stock } = book;
      db.run('INSERT INTO books (code, title, author, stock) VALUES (?,?,?,?)',
        [code, title, author, stock], function (err) {
          if(err) reject(err);
          resolve ({id: this.lastID});
        });
    });
  }
}

module.exports = BookRepository;