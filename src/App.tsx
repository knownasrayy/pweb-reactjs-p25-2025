import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BooksListPage from './pages/BooksListPage'
import BookDetailPage from './pages/BookDetailPage'
import TransactionsPage from './pages/TransactionsPage'
import TransactionDetailPage from './pages/TransactionDetailPage'
import AddBookPage from './pages/AddBookPage'
import ProtectedRoute from './utils/ProtectedRoute'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<BooksListPage />} />
          <Route path="/books" element={<BooksListPage />} />
          <Route path="/books/add" element={<AddBookPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App