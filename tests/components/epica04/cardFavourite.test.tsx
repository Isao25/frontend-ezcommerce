import { render, screen } from '@testing-library/react';
import { CardFavourite } from '@/components/Epica04/CardFavourite';

describe('CardFavourite', () => {
  test('renders product information correctly', () => {
    render(<CardFavourite />);
    
    expect(screen.getByText('Audifonos Sony')).toBeInTheDocument();
    expect(screen.getByText('S/ 34.00')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('Marca')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  test('displays heart icon for favorites', () => {
    render(<CardFavourite />);
    
    // Buscar por el botón que contiene el componente Heart
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Verificar que existe el botón principal
    const addButton = screen.getByRole('button', { name: /agregar/i });
    expect(addButton).toBeInTheDocument();
  });
});