const db = require('../config/database');

class LendRepository {
  static lendBooks(memberCode, bookCodes) {
    return new Promise((resolve, reject) => {
      const borrowedAt = new Date();
      const dueDate = new Date(borrowedAt.getTime() + 7 * 24 * 60 * 60 * 1000); //alias 1 minggu

      db.run('INSERT INTO lendings (member_code, borrowed_at, due_date) VALUES (?,?,?) ', 
        [memberCode, borrowedAt, dueDate], function (err) {
          if(err) return reject(err);
          
          const lendingId = this.lastID;
          
          const stmt = db.prepare('INSERT INTO lending_details (lending_id, book_code) VALUES (?,?)');
          bookCodes.forEach((bookCode) => {
            stmt.run(lendingId, bookCode);
          });
          
          stmt.finalize();
          
          resolve(lendingId);
        }
      )
    })
  }
  
  static returnBooks(memberCode, lendingId) {
    return new Promise((resolve, reject) => {
      const returnedAt = new Date();
      
      console.log(returnedAt, memberCode, lendingId)
      
      db.run('UPDATE lendings SET returned_at = ? , status = "returned" WHERE member_code = ? AND id = ?', 
        [returnedAt, memberCode, lendingId], function (err) {
          if(err) return reject(err);
          resolve();
      });
    });
  }
  
  static calculatePenalty(lendingId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT due_date, returned_at FROM lendings WHERE id = ?', [lendingId], (err, row) => {
        if (err) return reject(err);
        if (row) {
          const dueDate = new Date(row.due_date);
          const returnedAt = row.returned_at ? new Date(row.returned_at) : new Date();
          const penaltyDays = Math.max(0, Math.ceil((returnedAt - dueDate) / (1000 * 60 * 60 * 24))); //alias 1 minggu
          const penaltyAmount = penaltyDays * 2000; // example 2000/day
          resolve(penaltyAmount);
        } else {
          resolve(0); 
        }
      });
    });
  }
}

module.exports = LendRepository;