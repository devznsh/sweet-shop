import { useState, useEffect } from 'react';
import { Sweet, CreateSweetRequest, UpdateSweetRequest } from '../types';
import { sweetsApi } from '../api/sweets.api';
import { SweetForm } from '../components/SweetForm';
import { toast } from 'react-toastify';

export const AdminPanel = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await sweetsApi.getAllSweets(1, 100);
      setSweets(response.sweets);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSweet = async (data: CreateSweetRequest) => {
    try {
      await sweetsApi.createSweet(data);
      toast.success('Sweet created successfully!');
      setShowForm(false);
      fetchSweets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create sweet');
    }
  };

  const handleUpdateSweet = async (data: UpdateSweetRequest) => {
    if (!editingSweet) return;

    try {
      await sweetsApi.updateSweet(editingSweet.id, data);
      toast.success('Sweet updated successfully!');
      setEditingSweet(null);
      setShowForm(false);
      fetchSweets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update sweet');
    }
  };

  const handleDeleteSweet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsApi.deleteSweet(id);
      toast.success('Sweet deleted successfully!');
      fetchSweets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete sweet');
    }
  };

  const handleRestock = async (id: string) => {
    if (restockQuantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      await sweetsApi.restockSweet(id, { quantity: restockQuantity });
      toast.success('Sweet restocked successfully!');
      setRestockId(null);
      setRestockQuantity(0);
      fetchSweets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to restock sweet');
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const handleNewSweet = () => {
    setEditingSweet(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sweet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sweet-50 to-sweet-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍬 Admin Panel
          </h1>
          <p className="text-gray-600">Manage your sweet shop inventory</p>
        </div>

        <div className="mb-6">
          <button
            onClick={handleNewSweet}
            className="px-6 py-3 bg-sweet-500 text-white rounded-lg hover:bg-sweet-600 transition-colors font-medium"
          >
            + Add New Sweet
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSweet ? 'Edit Sweet' : 'Create New Sweet'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSweet(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <SweetForm
              onSubmit={editingSweet ? handleUpdateSweet : handleCreateSweet}
              initialData={editingSweet || undefined}
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sweet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sweets.map((sweet) => (
                <tr key={sweet.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {sweet.imageUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={sweet.imageUrl}
                            alt={sweet.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-sweet-200 flex items-center justify-center">
                            🍭
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {sweet.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-sweet-100 text-sweet-800">
                      {sweet.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${sweet.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {restockId === sweet.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={restockQuantity}
                          onChange={(e) =>
                            setRestockQuantity(parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sweet-500"
                        />
                        <button
                          onClick={() => handleRestock(sweet.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setRestockId(null);
                            setRestockQuantity(0);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            sweet.quantity === 0
                              ? 'text-red-600'
                              : sweet.quantity < 10
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {sweet.quantity}
                        </span>
                        <button
                          onClick={() => setRestockId(sweet.id)}
                          className="text-sweet-600 hover:text-sweet-700 text-sm"
                        >
                          + Restock
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleEdit(sweet)}
                      className="text-sweet-600 hover:text-sweet-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSweet(sweet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
