import { render, screen } from '@testing-library/react';
import { CardOrderSummary } from '../../../src/components/Epica04/CardOrderSummary';

jest.mock('@/context/CartContext', () => ({
  useCartContext: () => ({
    items: [
      { productPrice: 10, quantity: 2 },
      { productPrice: 5, quantity: 3 },
    ],
  }),
}));

describe('CardOrderSummary', () => {
  it('muestra resumen si hay productos en el carrito', () => {
    render(<CardOrderSummary />);
    expect(screen.getByText('Orden total')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // 2 + 3 productos
    expect(screen.getByText('S/ 35.00')).toBeInTheDocument(); // 10*2 + 5*3
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
  });

  it('no renderiza nada si el carrito está vacío', () => {
    jest.mocked(require('@/context/CartContext').useCartContext).mockReturnValueOnce({ items: [] });
    const { container } = render(<CardOrderSummary />);
    expect(container).toBeEmptyDOMElement();
  });
});
