//C Create a new book
const Book = require("../models/Book");
const createBook = async (req, res) => {

    try {
        const { title, author, coverImage, isbn, category, description, status } = req.body;
        const book = await Book.create({
            title,
            author,
            coverImage,
            isbn,
            category,
            description,
            status,
            createdBy: req.user._id, // 当前登录用户 id
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//R Get all books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate("createdBy", "name email");
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//R Get book detail findById
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate(
            "createdBy",
            "name email"
        );

        if (!book) {return res.status(404).json({ message: "Book not found" });}
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//U Update book
const updateBook = async (req, res) => {
    try {
        const { title, author, coverImage, isbn, category, description, status } = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) {return res.status(404).json({ message: "Book not found" });}

        book.title = title ?? book.title;
        book.author = author ?? book.author;
        book.coverImage = coverImage ?? book.coverImage;
        book.isbn = isbn ?? book.isbn;
        book.category = category ?? book.category;
        book.description = description ?? book.description;
        book.status = status ?? book.status;

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//D Delete book
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {return res.status(404).json({ message: "Book not found" });}

        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
};