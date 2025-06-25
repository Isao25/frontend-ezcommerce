import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../../src/components/cards/product-card';
import { BrowserRouter } from 'react-router-dom';

// 💥 Mocks externos
const mockAddItem = jest.fn();
const mockToggleFavourite = jest.fn();
const mockNavigate = jest.fn();

// 🔧 Mocks de contextos y navegación
jest.mock('@/context/CartContext', () => ({
  useCartContext: jest.fn(() => ({
    addItem: mockAddItem,
  })),
}));

jest.mock('@/context/FavouritesContext', () => ({
  useFavouritesContext: jest.fn(() => ({
    favourites: [],
    toggleFavourite: mockToggleFavourite,
  })),
}));

jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProductCard', () => {
  const defaultProps = {
    id: 1,
    name: 'Producto Genial',
    price: 99.99,
    img: 'https://via.placeholder.com/150',
    brand: 'Marca Pro',
    qualification: 4.5,
  };

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ProductCard {...defaultProps} />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el producto correctamente', () => {
    renderComponent();
    expect(screen.getByText('Producto Genial')).toBeInTheDocument();
    expect(screen.getByText('S/ 99.99')).toBeInTheDocument();
    expect(screen.getByText('Marca Pro')).toBeInTheDocument();
  });

  it('llama a navigate al hacer click en el contenido', () => {
    renderComponent();
    const image = screen.getByAltText('Producto Genial');
    const content = image.closest('div');
    fireEvent.click(content!);
    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });

  it('evita navegar y llama a addItem al hacer click en el botón "Agregar"', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Agregar'));
    expect(mockAddItem).toHaveBeenCalledWith(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

});
