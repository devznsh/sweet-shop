import { useState, useCallback } from 'react';
import { Sweet, SweetsListResponse, SearchParams } from '../types';
import { sweetsApi } from '../api/sweets.api';
import { toast } from 'react-toastify';

export const useSweets = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchSweets = useCallback(async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      const response: SweetsListResponse = await sweetsApi.getAllSweets(page, limit);
      setSweets(response.sweets);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSweets = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      const response: SweetsListResponse = await sweetsApi.searchSweets(params);
      setSweets(response.sweets);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseSweet = useCallback(async (id: string, quantity: number) => {
    try {
      await sweetsApi.purchaseSweet(id, { quantity });
      toast.success('Purchase successful!');
      // Refresh the sweets list
      fetchSweets(pagination.page, pagination.limit);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Purchase failed');
      throw error;
    }
  }, [pagination.page, pagination.limit, fetchSweets]);

  return {
    sweets,
    loading,
    pagination,
    fetchSweets,
    searchSweets,
    purchaseSweet,
  };
};
