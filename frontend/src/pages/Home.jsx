import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="p-6 text-lg">Loading books...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Book Index</h1>
        <p className="text-gray-600">
          Browse the available books in the library.
        </p>
      </div>

      {books.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-700 mb-4">No books found.</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login to manage books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
            >
                <div className="bg-gray-200 flex items-center justify-center h-60">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-52 object-cover rounded shadow mb-4 flex items-center justify-center"
                    />
                </div>
              

              <h2 className="text-lg font-bold mb-1">{book.title}</h2>
              <p className="text-gray-700 mb-1">{book.author}</p>
              <p className="text-sm text-gray-500 mb-1">
                Category: {book.category}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Status: {book.status}
              </p>

              <p className="text-sm text-gray-600 line-clamp-3">
                {book.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;