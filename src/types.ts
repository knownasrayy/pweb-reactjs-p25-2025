export interface Genre {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  writer: string;
  price: number;
  stockQuantity: number;
  genre: Genre;
  publisher?: string;
  isbn?: string;
  description?: string;
  publicationYear?: number;
  condition?: string;
}

export interface TransactionDetail {
  id: string;
  quantity: number;
  priceAtBuy: number;
  book: {
    id: string;
    title: string;
  };
}

export interface Transaction {
  id: string;
  createdAt: string;
  totalAmount: number;
  transactionItems: TransactionDetail[];
}