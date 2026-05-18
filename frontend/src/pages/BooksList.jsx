import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const BooksList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await axiosInstance.get("/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      alert(error.response?.data?.message || "Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return books;
    return books.filter((book) =>
      book.title?.toLowerCase().includes(keyword) ||
      book.author?.toLowerCase().includes(keyword) ||
      book.category?.toLowerCase().includes(keyword) ||
      book.isbn?.toLowerCase().includes(keyword) ||
      book.status?.toLowerCase().includes(keyword)
    );
  }, [books, searchTerm]);

  const handleDelete = async (bookId) => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete book.");
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await axiosInstance.post(`/api/books/${bookId}/borrow`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to borrow book.");
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await axiosInstance.post(`/api/books/${bookId}/return`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to return book.");
    }
  };

  if (loading) return <div className="p-6">Loading books...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Book Records</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search title, author, ISBN, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 p-2 border rounded"
          />
          {user?.role === 'admin' && (
            <Link
              to="/books/add"
              className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap"
            >
              Add Book
            </Link>
          )}
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">No matching books found.</div>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Cover</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Author</th>
                <th className="p-3 border">ISBN</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td className="p-3 border">
                    <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="p-3 border">{book.title}</td>
                  <td className="p-3 border">{book.author}</td>
                  <td className="p-3 border">{book.isbn}</td>
                  <td className="p-3 border">{book.category}</td>
                  <td className="p-3 border">{book.status}</td>
                  <td className="p-3 border">
                    <div className="flex gap-2 flex-wrap">
                      {user?.role === 'admin' ? (
                        <>
                          <Link
                            to={`/books/edit/${book._id}`}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          {book.status === 'available' ? (
                            <button
                              onClick={() => handleBorrow(book._id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Borrow
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReturn(book._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Return
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BooksList;
