import { useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SweetCard } from '../components/SweetCard';
import { useSweets } from '../hooks/useSweets';
import { SearchParams } from '../types';

export const Home = () => {
  const { sweets, loading, pagination, fetchSweets, searchSweets, purchaseSweet } =
    useSweets();

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = (params: SearchParams) => {
    if (Object.keys(params).length === 0) {
      fetchSweets();
    } else {
      searchSweets(params);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchSweets(newPage, pagination.limit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sweet-50 to-sweet-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍭 Welcome to Sweet Shop 🍬
          </h1>
          <p className="text-lg text-gray-600">
            Discover our delicious collection of sweets!
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sweet-500"></div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-xl text-gray-600">No sweets found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onPurchase={purchaseSweet}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          page === pagination.page
                            ? 'bg-sweet-500 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
