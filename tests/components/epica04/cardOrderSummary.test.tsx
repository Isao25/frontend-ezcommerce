import { render, screen } from '@testing-library/react';
import { CardOrderSummary } from '@/components/Epica04/CardOrderSummary';

// Mock the useCartContext hook
const mockUseCartContext = jest.fn();

jest.mock('@/context/CartContext', () => ({
  useCartContext: () => mockUseCartContext()
}));

describe('CardOrderSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('no renderiza nada si el carrito está vacío', () => {
    mockUseCartContext.mockReturnValue({ 
      items: [] 
    });
    
    const { container } = render(<CardOrderSummary />);
    expect(container).toBeEmptyDOMElement();
  });

  test('muestra resumen cuando hay productos', () => {
    mockUseCartContext.mockReturnValue({
      items: [
        { 
          productPrice: 10, 
          quantity: 2,
          productTitle: 'Product 1'
        },
        { 
          productPrice: 15, 
          quantity: 1,
          productTitle: 'Product 2'
        }
      ]
    });

    render(<CardOrderSummary />);
    
    expect(screen.getByText('Orden total')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Total items
    expect(screen.getByText('S/ 35.00')).toBeInTheDocument(); // Total price
  });
});
