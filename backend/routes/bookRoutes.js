const express = require('express');
const router = express.Router();

const {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
} = require('../controllers/bookController');

const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const reviewRoutes = require('./reviewRoutes');

// Public routes
router.get('/',    getBooks);
router.get('/:id', getBookById);

// Admin-only CRUD routes
router.post('/',       protect, isAdmin, createBook);
router.put('/:id',     protect, isAdmin, updateBook);
router.delete('/:id',  protect, isAdmin, deleteBook);

// Customer borrow/return routes
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);

// Nested review routes
router.use('/:id/reviews', reviewRoutes);

module.exports = router;
