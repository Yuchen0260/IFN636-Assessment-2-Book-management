import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <p className="mb-2">
          <strong>Welcome:</strong> {user?.name || "User"}
        </p>
        <p className="mb-6">
          <strong>Email:</strong> {user?.email || "No email"}
        </p>

        <div className="flex gap-4">
          <Link
            to="/books"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Book Records Management
          </Link>

          <Link
            to="/books/add"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add New Book
          </Link>

          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;