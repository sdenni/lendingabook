class Member {
  constructor(code, name, password, role, flagPenalty = "") {
    this.code = code;
    this.name = name;
    this.password = password;
    this.role = role;
    this.flagPenalty = flagPenalty
    this.borrowedBooks = [];
  }
  
  borrowBook(book) {
    this.borrowedBooks.push({
      bookCode: book.code,
      borrowedAt: new Date(),
      dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    })
  }
  
  returnBook(bookCode) {
    const index = this.borrowedBooks.findIndex(b => b.bookCode === bookCode);
    if(index !== -1) {
      const borrowedBook = this.borrowedBooks[index];
      const currentDate = new Date();
      const daysLate = Math.ceil((currentDate - borrowedBook.dueDate) / ( 1000 * 60 * 60 * 24 ));
      const penalty = daysLate > 0 ? daysLate * 2000 : 0; //dibuat 2000 perhari jika telat pengembalian
      
      this.borrowedBooks.splice(index, 1); 
      return { penalty };
    }
    
    return null;
  }
  
  givePenalty() {
    const currentDate = new Date();
    const penaltyDays = 3
    
    this.flagPenalty = currentDate.setDate(currentDate.getDate() + penaltyDays);
  }
  
  revokePenalty() {
    this.flagPenalty = null;
  }
  
  isPenalty() {
    if (!this.flagPenalty) {
      return false; 
    }

    const currentDate = new Date();
    if (currentDate <= this.flagPenalty) {
      return true;
    }
    
    return false;
  }
  
}

module.exports = Member;