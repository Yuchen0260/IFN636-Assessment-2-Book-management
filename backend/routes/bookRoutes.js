const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { protect } = require("../middleware/authMiddleware");

// 所有 Book 路由都受保护
router.post("/", protect, createBook);
router.get("/", protect, getBooks);
router.get("/:id", protect, getBookById);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;