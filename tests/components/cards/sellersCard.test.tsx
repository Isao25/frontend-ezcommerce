// tests/components/SellersCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SellersCard } from '../../../src/components/cards/sellers-card';
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SellersCard', () => {
  const defaultProps = {
    id: '123',
    name: 'Vendedor Pro',
  };

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SellersCard {...defaultProps} />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el nombre y la imagen correctamente', () => {
    renderComponent();

    expect(screen.getByText('Vendedor Pro')).toBeInTheDocument();
    expect(screen.getByAltText('perfil-123')).toBeInTheDocument();
    expect(screen.getByAltText('flecha-derecha')).toBeInTheDocument();
  });

  it('navega al perfil del vendedor al hacer click en el botón', () => {
    renderComponent();

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/profile-buyer?id=123');
  });
});
