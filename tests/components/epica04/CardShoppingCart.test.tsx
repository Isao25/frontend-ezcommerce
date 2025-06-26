import { render, screen, fireEvent } from '@testing-library/react';
import { CardShoppingCart } from '@/components/Epica04/CardShoppingCart';

// Mock the cart context
const mockUseCartContext = jest.fn();
jest.mock('@/context/CartContext', () => ({
  useCartContext: () => mockUseCartContext()
}));

describe('CardShoppingCart', () => {
  const mockProduct = {
    productTitle: 'Test Product',
    productPrice: 50.00,
    quantity: 2,
    ownerProduct: 'Test Owner',
    productDescription: 'Test Description',
    productUrl: 'test-image.jpg',
    productRating: 4.5
  };

  const mockRemoveItem = jest.fn();
  const mockUpdateItemQuantity = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCartContext.mockReturnValue({
      removeItem: mockRemoveItem,
      updateItemQuantity: mockUpdateItemQuantity
    });
  });

  test('renders product information correctly', () => {
    render(<CardShoppingCart product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Precio: S/ 50.00')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // quantity
    expect(screen.getByText('S/ 100.00')).toBeInTheDocument(); // total price
  });

  test('handles remove item', () => {
    render(<CardShoppingCart product={mockProduct} />);

    const removeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(removeButton);

    expect(mockRemoveItem).toHaveBeenCalledWith('Test Product');
  });

  test('handles increment quantity', () => {
    render(<CardShoppingCart product={mockProduct} />);

    const incrementButton = screen.getByRole('button', { name: /plus/i });
    fireEvent.click(incrementButton);

    expect(mockUpdateItemQuantity).toHaveBeenCalledWith('Test Product', 3);
  });

  test('handles decrement quantity', () => {
    render(<CardShoppingCart product={mockProduct} />);

    const decrementButton = screen.getByRole('button', { name: /minus/i });
    fireEvent.click(decrementButton);

    expect(mockUpdateItemQuantity).toHaveBeenCalledWith('Test Product', 1);
  });

  test('does not decrement below 1', () => {
    const productWithMinQuantity = { ...mockProduct, quantity: 1 };
    
    render(<CardShoppingCart product={productWithMinQuantity} />);

    const decrementButton = screen.getByRole('button', { name: /minus/i });
    fireEvent.click(decrementButton);

    expect(mockUpdateItemQuantity).not.toHaveBeenCalled();
  });
});