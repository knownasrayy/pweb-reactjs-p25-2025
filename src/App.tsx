import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksListPage from './pages/BooksListPage';
import BookDetailPage from './pages/BookDetailPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import AddBookPage from './pages/AddBookPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './utils/ProtectedRoute';
import MainLayout from './utils/MainLayout'; // <-- IMPORT LAYOUT BARU

function App() {
  return (
    <>
      {/* Navbar sudah TIDAK ada di sini */}
      <Routes>
        {/* Rute Publik (Tanpa Navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rute Terproteksi (Dibungkus ProtectedRoute) */}
        <Route element={<ProtectedRoute />}>
          {/* Semua rute di sini akan menggunakan MainLayout (YANG ADA NAVBAR-NYA) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<BooksListPage />} />
            <Route path="/books" element={<BooksListPage />} />
            <Route path="/books/add" element={<AddBookPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;