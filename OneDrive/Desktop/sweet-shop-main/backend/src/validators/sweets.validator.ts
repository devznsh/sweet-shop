import { z } from 'zod';

export const createSweetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional()
});

export const updateSweetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  category: z.string().min(2, 'Category must be at least 2 characters').optional(),
  price: z.number().positive('Price must be positive').optional(),
  quantity: z.number().int().nonnegative('Quantity must be non-negative').optional(),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional()
});

export const purchaseSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive')
});

export const restockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive')
});

export const searchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional()
});

export type CreateSweetInput = z.infer<typeof createSweetSchema>;
export type UpdateSweetInput = z.infer<typeof updateSweetSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type RestockInput = z.infer<typeof restockSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
