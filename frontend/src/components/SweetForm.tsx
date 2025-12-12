import { useForm } from 'react-hook-form';
import { CreateSweetRequest, UpdateSweetRequest, Sweet } from '../types';

interface SweetFormProps {
  onSubmit: (data: CreateSweetRequest | UpdateSweetRequest) => Promise<void>;
  initialData?: Sweet;
  isLoading?: boolean;
}

const CATEGORIES = ['Chocolates', 'Candies', 'Cakes', 'Ice Cream', 'Pastries'];

export const SweetForm: React.FC<SweetFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSweetRequest>({
    defaultValues: initialData || {
      name: '',
      category: 'Chocolates',
      price: 0,
      quantity: 0,
      description: '',
      imageUrl: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          {...register('name', { required: 'Name is required', minLength: 2 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0.01, message: 'Price must be positive' },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            {...register('quantity', {
              required: 'Quantity is required',
              min: { value: 0, message: 'Quantity cannot be negative' },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <input
          type="url"
          {...register('imageUrl')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-sweet-500 text-white rounded-lg hover:bg-sweet-600 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Sweet' : 'Create Sweet'}
        </button>
      </div>
    </form>
  );
};
