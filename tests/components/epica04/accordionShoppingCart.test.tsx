import { render, screen } from '@testing-library/react';
import { AccordionShoppingCart } from '../../../src/components/Epica04/AccordionShoppingCart';

// Mock del contexto
jest.mock('@/context/CartContext', () => ({
  useCartContext: () => ({
    items: [
      {
        productTitle: 'Producto 1',
        productPrice: 20,
        quantity: 1,
        ownerProduct: 'Vendedor A',
      },
      {
        productTitle: 'Producto 2',
        productPrice: 30,
        quantity: 2,
        ownerProduct: 'Vendedor B',
      },
    ],
  }),
}));

jest.mock('../../../src/components/cart/CardShoppingCart', () => ({
  CardShoppingCart: ({ product }: any) => <div>{product.productTitle}</div>,
}));

describe('AccordionShoppingCart', () => {
  it('renderiza el mensaje de carrito vacío si no hay productos', () => {
    jest.mocked(require('@/context/CartContext').useCartContext).mockReturnValueOnce({ items: [] });
    render(<AccordionShoppingCart />);
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it('agrupa y muestra productos por vendedor', () => {
    render(<AccordionShoppingCart />);
    expect(screen.getByText('Vendido por:')).toBeInTheDocument();
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
  });
});
