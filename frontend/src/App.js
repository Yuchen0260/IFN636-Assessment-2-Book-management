import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
// import Profile from './pages/Profile';
// import Books from './pages/Books';

import Dashboard from "./pages/Dashboard";
import BooksList from "./pages/BooksList";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/books" element={<BooksList />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books/add" element={<AddBook />} />
        <Route path="/books/edit" element={<EditBook />} />

      </Routes>
    </Router>
  );
}

export default App;
