import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from '../context/AuthContext';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [bookActionLoading, setBookActionLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: "5",
    comment: "",
  });
  const { user } = useAuth();

  const fetchBook = async () => {
    const response = await axiosInstance.get(`/api/books/${id}`);
    setBook(response.data);
  };

  const fetchReviews = async () => {
    const response = await axiosInstance.get(`/api/books/${id}/reviews`);
    setReviews(response.data.reviews || []);
    setAvgRating(response.data.avgRating || 0);
  };

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        await Promise.all([fetchBook(), fetchReviews()]);
      } catch (error) {
        console.error("Failed to fetch book detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  const handleBorrowReturn = async (action) => {
    if (!user?.token) {
      alert("Please login first.");
      return;
    }

    try {
      setBookActionLoading(true);
      await axiosInstance.post(
        `/api/books/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      await fetchBook();
    } catch (error) {
      console.error(`Failed to ${action} book:`, error);
      alert(error.response?.data?.message || `Failed to ${action} book.`);
    } finally {
      setBookActionLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert("Please login first.");
      return;
    }

    try {
      setSubmittingReview(true);
      await axiosInstance.post(
        `/api/books/${id}/reviews`,
        {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setReviewForm({
        rating: "5",
        comment: "",
      });
      await fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading book details...</div>;
  }

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="mb-4">Book not found.</p>
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: cover */}
          <div className="md:col-span-1">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full max-w-xs mx-auto rounded-lg shadow object-cover"
            />
          </div>

          {/* Right: info */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

            <div className="space-y-3 text-lg">
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Category:</strong> {book.category}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    book.status === "available"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {book.status}
                </span>
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
              <div className="bg-gray-50 border rounded-lg p-4 text-gray-700 leading-7">
                {book.description || "No description available."}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Back to Home
              </Link>

              {!user ?(
                <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Login to Manage
                </Link>) : (
                <>
                  <Link
                    to="/books"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Go to Manage
                  </Link>

                  {book.status === "available" && (
                    <button
                      onClick={() => handleBorrowReturn("borrow")}
                      disabled={bookActionLoading}
                      className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                      {bookActionLoading ? "Processing..." : "Borrow Book"}
                    </button>
                  )}

                  {book.status === "borrowed" && (
                    <button
                      onClick={() => handleBorrowReturn("return")}
                      disabled={bookActionLoading}
                      className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                      {bookActionLoading ? "Processing..." : "Return Book"}
                    </button>
                  )}
                </>
              )}
               
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                <div className="text-sm text-gray-600">
                  Average Rating: <span className="font-semibold">{avgRating}/5</span>
                </div>
              </div>

              {user ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-gray-50 border rounded-lg p-4 mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm((prev) => ({ ...prev, rating: e.target.value }))
                        }
                        className="w-full border rounded p-2"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Very Poor</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                        }
                        placeholder="Write your review here..."
                        className="w-full border rounded p-2 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-4 mb-6 text-gray-700">
                  Please log in to submit a review.
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="bg-gray-50 border rounded-lg p-4 text-gray-600">
                  No reviews yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 border rounded-lg p-4">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div>
                          <p className="font-semibold">{review.user?.name || "Anonymous User"}</p>
                          <p className="text-sm text-gray-500">{review.user?.email || ""}</p>
                        </div>
                        <div className="text-sm font-semibold text-yellow-700">
                          Rating: {review.rating}/5
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment || "No comment provided."}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
