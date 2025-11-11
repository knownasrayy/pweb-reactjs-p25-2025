import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { registerSchema } from '../utils/validationSchemas';
import { z, ZodError } from 'zod';
import type { ZodIssue } from 'zod';
import styles from './AuthForm.module.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    try {
      registerSchema.parse({ username, email, password });
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err: ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);
    try {
      await registerUser({ username, email, password });
      navigate('/login');
    } catch (error) {
      setApiError('Registrasi gagal. Email mungkin sudah terdaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authContainer}>
        <div className={styles.promoPanel}>
          <h2>Buat Akun Baru</h2>
          <p>Mulai koleksi buku digital-mu dan lacak semua transaksimu dengan mudah.</p>
        </div>
        <div className={styles.formPanel}>
          <h1>Create an Account</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className={styles.fieldError}>{errors.username}</p>}
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
            </div>
            
            {apiError && <p className={styles.apiError}>{apiError}</p>}
            
            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? 'Loading...' : 'Buat Akun'}
            </button>
          </form>
          <div className={styles.toggleLink}>
            Sudah punya akun? <Link to="/login">Login di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;