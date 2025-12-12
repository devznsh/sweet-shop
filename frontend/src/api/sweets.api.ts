import { axiosInstance } from './axios';
import {
  Sweet,
  SweetsListResponse,
  SearchParams,
  CreateSweetRequest,
  UpdateSweetRequest,
  PurchaseRequest,
  RestockRequest
} from '../types';

export const sweetsApi = {
  getAllSweets: async (page = 1, limit = 10): Promise<SweetsListResponse> => {
    const response = await axiosInstance.get<SweetsListResponse>('/sweets', {
      params: { page, limit }
    });
    return response.data;
  },

  getSweetById: async (id: string): Promise<Sweet> => {
    const response = await axiosInstance.get<Sweet>(`/sweets/${id}`);
    return response.data;
  },

  searchSweets: async (params: SearchParams): Promise<SweetsListResponse> => {
    const response = await axiosInstance.get<SweetsListResponse>('/sweets/search', {
      params
    });
    return response.data;
  },

  createSweet: async (data: CreateSweetRequest): Promise<Sweet> => {
    const response = await axiosInstance.post<Sweet>('/sweets', data);
    return response.data;
  },

  updateSweet: async (id: string, data: UpdateSweetRequest): Promise<Sweet> => {
    const response = await axiosInstance.put<Sweet>(`/sweets/${id}`, data);
    return response.data;
  },

  deleteSweet: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/sweets/${id}`);
  },

  purchaseSweet: async (id: string, data: PurchaseRequest): Promise<Sweet> => {
    const response = await axiosInstance.post<Sweet>(`/sweets/${id}/purchase`, data);
    return response.data;
  },

  restockSweet: async (id: string, data: RestockRequest): Promise<Sweet> => {
    const response = await axiosInstance.post<Sweet>(`/sweets/${id}/restock`, data);
    return response.data;
  }
};
