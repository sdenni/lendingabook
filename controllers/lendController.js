const LendRepository = require('../repositories/lendRepository');
const BookRepository = require('../repositories/bookRepository');
const MemberRepository = require('../repositories/memberRepository');
const Book = require('../domain/Book');
const Member = require('../domain/Member');

class LendController {
  static async lendBooks(req, res) {
    const { memberCode, bookCodes } = req.body;
    try {
        const maksLend = 2;
        let remainLend = 2;
        
        //validate if penalty
        let memberFind = new Member(memberCode, "", "", "");
        memberFind = await MemberRepository.find(memberFind);
        
        console.log(memberFind.isPenalty())
        
        if(memberFind.isPenalty()) {
        
          const flagPenaltyDate = new Date(memberFind.flagPenalty); 
          // readable timestamp
          const formattedDueDate = flagPenaltyDate.toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
          });
          
          return res.status(422).json({ message: 'Failed, you had penalty until : '+formattedDueDate });
        } else {
          memberFind.revokePenalty();
          await MemberRepository.updatePenalty(memberFind);
        }
        
        //validate if there is an active Lend with remain 1 book still be 
        const lends = await LendRepository.countActiveLendBook(memberCode);
        
        if(lends < maksLend) {
          remainLend = maksLend - lends;
        } else {
          return res.status(422).json({ message: 'Failed, you have lend '+lends+' of total active lended book' });
        }
    
        //validate only maks 2 books
        if (bookCodes.length > remainLend) {
          return res.status(422).json({ message: 'Failed, more than 2 books' });
        }

        const booksUnavailable = [];

        // Validate available books
        const books = await Promise.all(bookCodes.map(async (code) => {
            const findBook = new Book(code, "", "", "");
            const book = await BookRepository.findByCode(findBook);
            if (!book || !book.isAvailable()) {
                booksUnavailable.push(book);
                return null; 
            }
            return book;
        }));

        // validasi book available
        const availableBooks = books.filter(book => book !== null);

        if (availableBooks.length === bookCodes.length) {
            const lendingId = await LendRepository.lendBooks(memberCode, bookCodes);

            // stok management
            await Promise.all(availableBooks.map(async (book) => {
                book.borrowBook();
                await BookRepository.updateStock(book);
            }));

            return res.status(201).json({ message: 'Books lent successfully', lendingId });
        } else {
            return res.status(422).json({ message: 'Books lent failed, books unavailable', books: booksUnavailable });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to lend books' });
    }
}

  static async returnBooks(req, res) {
    const { memberCode, lendId , bookCodes } = req.body;
    try {
    
      const isProcess = await LendRepository.checkActiveLendingId(lendId);
      if(!isProcess){
        res.status(200).json({ message: 'Lend transaction has been returned last time ? todo add time'});  
        return
      }
    
      //get Lended books
      const lendsBooks = await LendRepository.getLendedBooksbyLendingId(lendId);
      
      const returnedBooks = await Promise.all(lendsBooks.map(async (el) => {      
        if(bookCodes.includes(el.book_code)) {

          let findBook = new Book(el.book_code, "", "", "");
          findBook = await BookRepository.findByCode(findBook);
          
          const returned = await LendRepository.returnBook(lendId, el.book_code);
          
          if(returned) {
            // stok management
            findBook.returnBook()
            await BookRepository.updateStock(findBook);
            return findBook;
          }

          return null;
        }
        return null;
      }));
      
      //validate parent
      const countLendBooks = await LendRepository.countActiveBook(memberCode, lendId);
      if(countLendBooks==0) {
        await LendRepository.returnTransaction(memberCode, lendId)

        //check if there is penalty
        const penalty = await LendRepository.calculatePenalty(lendId);
        if(penalty > 0){
          let findMember = new Member(memberCode, "", "", "", "");
          findMember = await MemberRepository.find(findMember);
          
          findMember.givePenalty()
          findMember = await MemberRepository.updatePenalty(findMember);
        }
        // todo
        
        res.status(200).json({ message: 'Books returned successfully', books : returnedBooks });  
        
        
        
      } else {
        res.status(200).json({ message: 'Books returned successfully but not all of them', books : returnedBooks });  
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to return books', msg: ''+error });
    }
  }

  static async calculatePenalty(req, res) {
    const { lendId } = req.params;
    try {
      const penalty = await LendRepository.calculatePenalty(lendId);
      res.status(200).json({ penalty });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate penalty' });
    }
  }
}

module.exports = LendController;
