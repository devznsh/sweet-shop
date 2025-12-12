import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SweetCard } from '../../src/components/SweetCard';
import { Sweet } from '../../src/types';

const mockSweet: Sweet = {
  id: '1',
  name: 'Chocolate Bar',
  category: 'Chocolates',
  price: 2.99,
  quantity: 10,
  description: 'Delicious chocolate',
  imageUrl: 'https://example.com/image.jpg',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('SweetCard', () => {
  it('renders sweet information correctly', () => {
    render(
      <BrowserRouter>
        <SweetCard sweet={mockSweet} />
      </BrowserRouter>
    );

    expect(screen.getByText('Chocolate Bar')).toBeInTheDocument();
    expect(screen.getByText('Chocolates')).toBeInTheDocument();
    expect(screen.getByText('$2.99')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('shows out of stock when quantity is 0', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 };
    
    render(
      <BrowserRouter>
        <SweetCard sweet={outOfStockSweet} />
      </BrowserRouter>
    );

    expect(screen.getByText('OUT OF STOCK')).toBeInTheDocument();
  });

  it('disables purchase button when out of stock', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 };
    const mockOnPurchase = vi.fn();
    
    render(
      <BrowserRouter>
        <SweetCard sweet={outOfStockSweet} onPurchase={mockOnPurchase} />
      </BrowserRouter>
    );

    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseButton).toBeDisabled();
  });
});
