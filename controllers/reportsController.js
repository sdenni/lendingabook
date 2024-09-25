const LendRepository = require('../repositories/lendRepository');
const BookRepository = require('../repositories/bookRepository');
const MemberRepository = require('../repositories/memberRepository');
const Book = require('../domain/Book');
const Member = require('../domain/Member');

class ReportController {

  static async getBooks(req, res) {
    try {
      const books = await BookRepository.findAll();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Error pengambilan report buku' });
    }
  }
  
  static async getMembers(req, res) {
    try {
      let members = await MemberRepository.findAll();
      
      // member = members.map
      
      // Validate available books
      members = await Promise.all(members.map(async (el) => {
        // console.log(el)
        
        delete el.password
        
        
        let booksLend = await LendRepository.getActiveLendBook(el.code);
        // console.log(booksLend);
        
        el.bookLends = booksLend;
        
        return el;
      }));
      
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: 'Error pengambilan report member' });
    }
  }
  
}

module.exports = ReportController;
