import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getMe } from '../services/apiService';
import { loginSchema } from '../utils/validationSchemas';
import { z, ZodError } from 'zod';
import type { ZodIssue } from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiService';
import styles from './AuthForm.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    try {
      loginSchema.parse({ email, password });
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
      const loginResponse = await loginUser({ email, password });
      const token = loginResponse.data.accessToken;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const userResponse = await getMe();
      setUser(userResponse.data.data);
      
      navigate('/books');
    } catch (error) {
      setApiError('Login gagal. Cek kembali email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authContainer}>
        <div className={styles.promoPanel}>
          <h2>IT Literature Shop</h2>
          <p>Temukan buku-buku IT dan cybersecurity favoritmu di sini.</p>
        </div>
        <div className={styles.formPanel}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
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
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <div className={styles.toggleLink}>
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;