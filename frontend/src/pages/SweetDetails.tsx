import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sweet } from '../types';
import { sweetsApi } from '../api/sweets.api';
import { toast } from 'react-toastify';

export const SweetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sweet, setSweet] = useState<Sweet | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchSweet = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await sweetsApi.getSweetById(id);
        setSweet(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load sweet');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchSweet();
  }, [id, navigate]);

  const handlePurchase = async () => {
    if (!sweet || !id) return;

    if (quantity > sweet.quantity) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      setPurchasing(true);
      await sweetsApi.purchaseSweet(id, { quantity });
      toast.success('Purchase successful!');
      // Refresh the sweet data
      const updatedSweet = await sweetsApi.getSweetById(id);
      setSweet(updatedSweet);
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sweet-500"></div>
      </div>
    );
  }

  if (!sweet) {
    return null;
  }

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sweet-50 to-sweet-100 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-sweet-600 hover:text-sweet-700 flex items-center"
        >
          <span className="mr-2">←</span> Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              {sweet.imageUrl ? (
                <img
                  src={sweet.imageUrl}
                  alt={sweet.name}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-sweet-200 to-sweet-300 flex items-center justify-center">
                  <span className="text-9xl">🍭</span>
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-sweet-100 text-sweet-700 rounded-full text-sm font-medium">
                  {sweet.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {sweet.name}
              </h1>

              {sweet.description && (
                <p className="text-gray-700 text-lg mb-6">{sweet.description}</p>
              )}

              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-5xl font-bold text-sweet-600">
                    ${sweet.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-600">per item</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  <span className="font-medium">Stock Available:</span>{' '}
                  <span
                    className={`font-bold ${
                      sweet.quantity === 0
                        ? 'text-red-600'
                        : sweet.quantity < 10
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {sweet.quantity} units
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={sweet.quantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
                    disabled={isOutOfStock}
                  />
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={isOutOfStock || purchasing}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-sweet-500 text-white hover:bg-sweet-600'
                  }`}
                >
                  {purchasing
                    ? 'Processing...'
                    : isOutOfStock
                    ? 'Out of Stock'
                    : `Purchase ${quantity} item${quantity > 1 ? 's' : ''} - $${(
                        sweet.price * quantity
                      ).toFixed(2)}`}
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Added: {new Date(sweet.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
