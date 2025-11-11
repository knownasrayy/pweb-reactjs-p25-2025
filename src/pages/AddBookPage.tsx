import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres, addBook } from '../services/apiService';
import { bookSchema } from '../utils/validationSchemas';
import type { BookFormData } from '../utils/validationSchemas';
import { z, ZodError } from 'zod';
import type { ZodIssue } from 'zod';
import type { Genre } from '../types';

const AddBookPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    writer: '',
    publisher: '',
    publicationYear: '',
    genreId: '',
    price: '',
    stockQuantity: '',
    condition: 'New',
    isbn: '',
    description: '',
    image_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response.data.data);
      } catch (error) {
        console.error('Gagal mengambil genres', error);
      }
    };
    fetchGenres();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    try {
      const validatedData = bookSchema.parse(formData);
      
      setIsLoading(true);
      await addBook(validatedData);
      navigate('/books');

    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err: ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setApiError('Gagal menambahkan buku. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formStyle: React.CSSProperties = {
    padding: '2rem',
    maxWidth: '600px',
    margin: 'auto',
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: '1rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '4px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
  };

  const errorStyle: React.CSSProperties = {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '4px',
  };

  return (
    <div style={formStyle}>
      <h1>Tambah Buku Baru</h1>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Judul</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.title && <p style={errorStyle}>{errors.title}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Penulis</label>
          <input
            type="text"
            name="writer"
            value={formData.writer}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.writer && <p style={errorStyle}>{errors.writer}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Penerbit</label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.publisher && <p style={errorStyle}>{errors.publisher}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Tahun Terbit</label>
          <input
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.publicationYear && <p style={errorStyle}>{errors.publicationYear}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Genre</label>
          <select
            name="genreId"
            value={formData.genreId}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Pilih Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {errors.genreId && <p style={errorStyle}>{errors.genreId}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Harga</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.price && <p style={errorStyle}>{errors.price}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Stok</label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.stockQuantity && <p style={errorStyle}>{errors.stockQuantity}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Kondisi</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          {errors.condition && <p style={errorStyle}>{errors.condition}</p>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>ISBN (Optional)</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Deskripsi (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: '100px' }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>URL Gambar Cover (Optional)</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            style={inputStyle}
            placeholder="https://contoh.com/gambar.jpg"
          />
          {errors.image_url && <p style={errorStyle}>{errors.image_url}</p>}
        </div>

        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}

        <button type="submit" disabled={isLoading} style={{ padding: '10px 15px' }}>
          {isLoading ? 'Menyimpan...' : 'Tambah Buku'}
        </button>
      </form>
    </div>
  );
};

export default AddBookPage;