import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/apiService';
import type { Transaction } from '../types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './TransactionsPage.module.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [orderBy, setOrderBy] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page,
          search: search || undefined,
          sortBy,
          orderBy,
        };
        const response = await getTransactions(params);
        setTransactions(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (err) {
        setError('Gagal mengambil data transaksi.');
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [page, search, sortBy, orderBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newOrderBy] = e.target.value.split('-');
    setSortBy(newSortBy);
    setOrderBy(newOrderBy);
    setPage(1);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>Riwayat Transaksi</h1>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Cari berdasarkan ID..."
          value={search}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <select value={`${sortBy}-${orderBy}`} onChange={handleSortChange} className={styles.selectInput}>
          <option value="createdAt-desc">Tanggal (Terbaru)</option>
          <option value="createdAt-asc">Tanggal (Terlama)</option>
          <option value="id-asc">ID (A-Z)</option>
          <option value="id-desc">ID (Z-A)</option>
          <option value="totalAmount-desc">Harga (Tertinggi)</option>
          <option value="totalAmount-asc">Harga (Terendah)</option>
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!isLoading && !error && transactions.length === 0 && (
        <p className={styles.emptyText}>Belum ada transaksi.</p>
      )}

      {!isLoading && !error && transactions.length > 0 && (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Tanggal</th>
                <th>Total Harga</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{new Date(tx.createdAt).toLocaleString('id-ID')}</td>
                  <td>Rp {tx.totalAmount.toLocaleString('id-ID')}</td>
                  <td>
                    <Link to={`/transactions/${tx.id}`}>Lihat Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
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
      )}
    </div>
  );
};

export default TransactionsPage;