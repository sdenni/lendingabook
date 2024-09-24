class Book {
  constructor(code, title, author, stock) {
    this.code = code;
    this.title = title;
    this.author = author;
    this.stock = stock;
  }
  
  isAvailable() {
    return this.stock > 0;
  }
  
  borrowBook() {
    if(this.isAvailable()) {
      this.stock -= 1;
      return true;
    }
    return false;
  }
  
  returnBook() {
    this.stock += 1;
  }
}

module.exports = Book;