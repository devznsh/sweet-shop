import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sweet } from '../types';
import { toast } from 'react-toastify';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (id: string, quantity: number) => Promise<void>;
}

export const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onPurchase) return;

    if (quantity > sweet.quantity) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      setPurchasing(true);
      await onPurchase(sweet.id, quantity);
      setQuantity(1);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setPurchasing(false);
    }
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/sweets/${sweet.id}`}>
        <div className="relative">
          {sweet.imageUrl ? (
            <img
              src={sweet.imageUrl}
              alt={sweet.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-sweet-200 to-sweet-300 flex items-center justify-center">
              <span className="text-6xl">🍭</span>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white text-xl font-bold">OUT OF STOCK</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/sweets/${sweet.id}`}>
          <h3 className="text-lg font-bold text-gray-800 hover:text-sweet-600 transition-colors">
            {sweet.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{sweet.category}</p>
        {sweet.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {sweet.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-sweet-600">
            ${sweet.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-600">
            Stock: {sweet.quantity}
          </span>
        </div>

        {onPurchase && (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
              disabled={isOutOfStock}
            />
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || purchasing}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-sweet-500 text-white hover:bg-sweet-600'
              }`}
            >
              {purchasing ? 'Purchasing...' : 'Purchase'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
