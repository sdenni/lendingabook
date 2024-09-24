const LendRepository = require('../repositories/lendRepository');
const BookRepository = require('../repositories/bookRepository');
const Book = require('../domain/Book');

class LendController {
  static async lendBooks(req, res) {
    const { memberCode, bookCodes } = req.body;
    try {
        if (bookCodes.length > 2) {
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
    const { memberCode, lendId } = req.body;
    try {
      await LendRepository.returnBooks(memberCode, lendId);
      res.status(200).json({ message: 'Books returned successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to return books' });
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
