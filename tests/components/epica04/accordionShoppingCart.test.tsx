import { render, screen } from '@testing-library/react';
import { AccordionShoppingCart } from '@/components/Epica04/AccordionShoppingCart';

// Mock the CartContext
const mockUseCartContext = jest.fn();
jest.mock('@/context/CartContext', () => ({
  useCartContext: () => mockUseCartContext()
}));

// Mock the CardShoppingCart component con la ruta correcta
jest.mock('@/components/Epica04/CardShoppingCart', () => ({
  CardShoppingCart: ({ product }: any) => (
    <div data-testid="cart-item">{product.productTitle}</div>
  ),
}));

describe('AccordionShoppingCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders products by seller', () => {
    mockUseCartContext.mockReturnValue({
      items: [
        {
          productTitle: 'Test Product',
          productPrice: 100,
          quantity: 2,
          ownerProduct: 'Test Owner',
          productDescription: 'Test Description',
          productUrl: 'test-url',
          productRating: 4
        }
      ]
    });

    render(<AccordionShoppingCart />);
    
    expect(screen.getByText(/Test Owner/)).toBeInTheDocument();
    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  test('shows empty message when no items', () => {
    mockUseCartContext.mockReturnValue({ items: [] });
    
    render(<AccordionShoppingCart />);
    
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });
});
