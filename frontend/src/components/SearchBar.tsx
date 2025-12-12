import { useState } from 'react';
import { SearchParams } from '../types';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

const CATEGORIES = ['All', 'Chocolates', 'Candies', 'Cakes', 'Ice Cream', 'Pastries'];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: SearchParams = {};
    
    if (searchTerm) params.name = searchTerm;
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (minPrice) params.minPrice = parseFloat(minPrice);
    if (maxPrice) params.maxPrice = parseFloat(maxPrice);

    onSearch(params);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sweet name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="$0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="$100.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-sweet-500 text-white rounded-lg hover:bg-sweet-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};
