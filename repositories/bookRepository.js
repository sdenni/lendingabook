const Book = require('../domain/Book'); // Import class Book
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
  
  static findByCode(book){
    return new Promise((resolve, reject) => {
      const { code } = book;
      db.all('SELECT * FROM books WHERE code = ? LIMIT 1', [code], (err, row) => {
        if(err) reject(err);
        if(row) {
          if (row) {
            const el = row[0];
            const foundBook = new Book(el.code, el.title, el.author, el.stock);
            resolve(foundBook); 
          } else {
            resolve(null); 
          }
        }
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
  
  static updateStock(book) {
    return new Promise((resolve, reject) => {
      const { code, title, author, stock } = book;
      db.run('UPDATE books SET stock = ? WHERE code = ?',
        [stock, code], function (err) {
          if(err) reject(err);
          resolve(book);
        }
      )
    })
  }
}

module.exports = BookRepository;