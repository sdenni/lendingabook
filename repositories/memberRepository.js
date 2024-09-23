const db = require('../config/database');

class MemberRepository {
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM members', [], (err, rows) => {
        if(err) reject(err);
        resolve(rows);
      })
    })
  }
  
  static create(book) {
    return new Promise((resolve, reject) => {
      const { code, name } = book;
      db.run('INSERT INTO members (code, name) VALUES (?,?)',
        [code, name], function (err) {
          if(err) reject(err);
          resolve ({id: this.lastID});
        });
    });
  }
}

module.exports = MemberRepository;