import React, { useState, useEffect } from 'react';
import { getBooks } from '../services/apiService';
import type { Book } from '../types';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BooksListPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [sort, setSort] = useState('title-asc');

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
          sort,
        };
        const response = await getBooks(params);
        setBooks(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Gagal mengambil data buku. Pastikan token Anda valid.');
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [page, search, condition, sort]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCondition(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  const containerStyle: React.CSSProperties = {
    padding: '2rem',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  };

  const listStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
  };

  return (
    <div style={containerStyle}>
      <div style={controlsStyle}>
        <h1>Daftar Buku</h1>
        <Link to="/books/add" style={{ padding: '10px 15px', background: 'blue', color: 'white', textDecoration: 'none', borderRadius: '5px', height: 'fit-content', alignSelf: 'center' }}>
          Tambah Buku
        </Link>
      </div>
      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="Cari berdasarkan judul..."
          value={search}
          onChange={handleSearchChange}
          style={{ padding: '8px' }}
        />
        <select value={condition} onChange={handleConditionChange} style={{ padding: '8px' }}>
          <option value="">Semua Kondisi</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
        <select value={sort} onChange={handleSortChange} style={{ padding: '8px' }}>
          <option value="title-asc">Judul (A-Z)</option>
          <option value="title-desc">Judul (Z-A)</option>
          <option value="date-asc">Tanggal Terbit (Lama)</option>
          <option value="date-desc">Tanggal Terbit (Baru)</option>
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && !error && books.length === 0 && (
        <p>Tidak ada buku yang ditemukan.</p>
      )}

      {!isLoading && !error && books.length > 0 && (
        <>
          <div style={listStyle}>
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div style={paginationStyle}>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Halaman {page} dari {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BooksListPage;