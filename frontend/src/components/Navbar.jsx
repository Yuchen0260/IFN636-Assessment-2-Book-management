import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        <div className="bg-white rounded-full px-4 py-2 shadow-sm inline-flex items-center hover:shadow-md hover:scale-105 transition-transform cursor-pointer">
          <img
            src="/LIBRARY%20LOGO.png"
            alt="Library logo"
            className="h-8 w-auto object-contain"
          />
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/books">Books</Link>
                <Link to="/books/add">Add Book</Link>
                <Link to="/admin" className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-700">
                  Admin
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
