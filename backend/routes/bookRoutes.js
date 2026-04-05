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

// 所有 Book 路由都受保护，除了get books部分，用于主页展示书籍和细节
router.post("/", protect, createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;