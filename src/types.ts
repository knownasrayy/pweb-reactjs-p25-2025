export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  writer: string;
  price: number;
  stock: number;
  genre: Genre;
  publisher?: string;
  isbn?: string;
  description?: string;
  publication_year?: number;
  condition?: string;
}

export interface BookApiResponse {
  data: Book[];
  page: number;
  totalPages: number;
}

export interface GenreApiResponse {
  data: Genre[];
}