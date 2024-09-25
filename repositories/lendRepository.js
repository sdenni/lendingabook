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
  
  static returnBook(lendingId, bookCode) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE lending_details SET status = "R" WHERE status = "A" AND lending_id = ? AND book_code = ?',
        [lendingId, bookCode], ((err) => {
          if(err) return err;
          resolve(true);
        })
      )
    })
  }
  
  static returnTransaction(memberCode, lendingId) {
    return new Promise((resolve, reject) => {
      const returnedAt = new Date();
      
      db.run('UPDATE lendings SET returned_at = ? , status = "R" WHERE member_code = ? AND id = ?', 
        [returnedAt, memberCode, lendingId], function (err) {
          if(err) return reject(err);
          resolve(1);
      });
    });
  }
  
  static getLendedBooksbyLendingId(lendingId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM lending_details WHERE status = "A" AND lending_id = ?', 
        [lendingId], (err, row) => {
          if(err) return reject(err);
          if(row) {
            resolve(row);
          }
        })
    })
  }
  
  static calculatePenalty(lendingId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT due_date, returned_at FROM lendings WHERE id = ?', [lendingId], (err, row) => {
        if (err) return reject(err);
        if (row) {
          const dueDate = new Date(row.due_date);
          const returnedAt = row.returned_at ? new Date(row.returned_at) : new Date();
          const penaltyDays = Math.max(0, Math.ceil((returnedAt - dueDate) / (1000 * 60 * 60 * 24))); 
          const penaltyAmount = penaltyDays * 2000; // example 2000/day
          resolve(penaltyAmount);
        } else {
          resolve(0); 
        }
      });
    });
  }
  
  static checkActiveLendingId(lendingId){
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) AS COUNT FROM lendings WHERE status = "A" AND id = ?',
        [lendingId], function (err, row) {
          if(err) return reject(err) 
          resolve(row.COUNT)
        }
      )
    });
  }
  
  /** dapat dioptimalisasikan dengan menggabungkan countActiveLendBook dan countActiveBook */
  static countActiveLendBook(memberCode) {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) AS JMLBOOKSLENDINGED FROM lending_details ld, lendings l WHERE l.id = ld.lending_id AND l.status = "A" AND ld.status = "A" AND l.member_code = ?',
        [memberCode], function (err, row) {
          if(err) return reject(err) 
          resolve(row.JMLBOOKSLENDINGED)
        }
      )
    });
  }
  
  /** dapat dioptimalisasikan dengan menggabungkan countActiveLendBook dan countActiveBook */
  static countActiveBook(memberCode, lendingId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) AS JMLBOOKSLENDINGED FROM lending_details ld, lendings l WHERE l.id = ld.lending_id AND l.status = "A" AND ld.status = "A" AND l.member_code = ? AND l.id = ?',
        [memberCode, lendingId], function (err, row) {
          if(err) return reject(err) 
          resolve(row.JMLBOOKSLENDINGED)
        }
      )
    });
  }
}

module.exports = LendRepository;