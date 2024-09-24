const bcrypt = require('bcryptjs');
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
  
  static create(member, type) {
    return new Promise(async (resolve, reject) => {
      const { code, name , password } = member;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      db.run('INSERT INTO members (code, name, password, role) VALUES (?,?,?,?)',
        [code, name, hashedPassword, type], function (err) {
          if(err) reject(err);
          resolve ({id: this.lastID});
        });
    });
  }
  
  static login(code, password) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM members WHERE code = ?', [code], async (err, user) => {
          if (err || !user) return res.status(400).json({ message: 'data anggota tidak ditemukan' });
          
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) reject("password salah");
          
          resolve(user);
      });
    })
  }
}

module.exports = MemberRepository;