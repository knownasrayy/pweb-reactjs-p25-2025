import React, { useState, useEffect } from 'react';
import { getBooks, getStats } from '../services/apiService';
import type { Book } from '../types';
import BookCard from '../components/BookCard';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './BooksListPage.module.css';

interface Stats {
  totalBooks: number;
  totalGenres: number;
  totalTransactions: number;
}

const BooksListPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [orderBy, setOrderBy] = useState('asc');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page,
          search: search || undefined,
          condition: condition || undefined,
          sortBy,
          orderBy,
        };
        const response = await getBooks(params);
        setBooks(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (err) {
        setError('Gagal mengambil data buku.');
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [page, search, sortBy, orderBy, condition]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCondition(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newOrderBy] = e.target.value.split('-');
    setSortBy(newSortBy);
    setOrderBy(newOrderBy);
    setPage(1);
  };

  const renderBookList = () => {
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className={styles.errorText}>{error}</p>;
    if (books.length === 0) return <p>Tidak ada buku yang ditemukan.</p>;

    const displayBooks = [...books];
    while (displayBooks.length > 0 && displayBooks.length < 10) {
      displayBooks.push(...books);
    }

    return (
      <>
        <div className={styles.bookListContainer}>
          <div className={styles.bookList}>
            {displayBooks.map((book, index) => (
              <BookCard key={`${book.id}-${index}-a`} book={book} />
            ))}
          </div>
          <div className={styles.bookList} aria-hidden="true">
            {displayBooks.map((book, index) => (
              <BookCard key={`${book.id}-${index}-b`} book={book} />
            ))}
          </div>
        </div>
        
        <div className={styles.pagination}>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>Halaman {page} dari {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </>
    );
  };

  return (
    <div className={styles.pageContainer}>
      
      {stats && (
        <div className={styles.statsContainer}>
          <StatCard icon={"📚"} title="Total Buku" value={stats.totalBooks} />
          <StatCard icon={"🔖"} title="Total Genre" value={stats.totalGenres} />
          <StatCard icon={"💳"} title="Total Transaksi" value={stats.totalTransactions} />
        </div>
      )}

      <div className={styles.header}>
        <h1>Daftar Buku</h1>
        <Link to="/books/add" className={styles.addButton}>
          Tambah Buku
        </Link>
      </div>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Cari berdasarkan judul..."
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <select value={`${sortBy}-${orderBy}`} onChange={handleSortChange} className={styles.selectInput}>
          <option value="title-asc">Judul (A-Z)</option>
          <option value="title-desc">Judul (Z-A)</option>
          <option value="publicationYear-asc">Tanggal Terbit (Lama)</option>
          <option value="publicationYear-desc">Tanggal Terbit (Baru)</option>
        </select>
        <select value={condition} onChange={handleConditionChange} className={styles.selectInput}>
          <option value="">Semua Kondisi</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      {renderBookList()}
    </div>
  );
};

export default BooksListPage;