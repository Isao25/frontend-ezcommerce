import { render, screen, waitFor } from '@testing-library/react';
import { CartProvider, useCartContext } from '@/context/CartContext';
import { act } from 'react-dom/test-utils';

// Mock the helper
jest.mock('@/helpers/getProducCart', () => ({
  getProductCart: jest.fn(() => Promise.resolve({
    productTitle: 'Test Product',
    productPrice: 100,
    productDescription: 'Test Description',
    productUrl: 'test-url',
    productRating: 4,
    quantity: 1,
    ownerProduct: 'Test Owner'
  }))
}));

const TestComponent = () => {
  const { items, addItem, removeItem, clearCart } = useCartContext();
  
  return (
    <div>
      <div data-testid="cart-count">{items.length}</div>
      <button onClick={() => addItem(1)} data-testid="add-item">
        Add Item
      </button>
      <button onClick={() => removeItem('Test Product')} data-testid="remove-item">
        Remove Item
      </button>
      <button onClick={clearCart} data-testid="clear-cart">
        Clear Cart
      </button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides initial cart state', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  test('adds item to cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      screen.getByTestId('add-item').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });
  });
});