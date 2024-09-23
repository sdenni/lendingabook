const BookRepository = require('../repositories/bookRepository');
const Book = require('../domain/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await BookRepository.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error pengambilan data buku' });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { code, title, author, stock } = req.body;
    const newBook = new Book(code, title, author, stock);
    const book = await BookRepository.create(newBook);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error pembuatan buku' });
  }
};
