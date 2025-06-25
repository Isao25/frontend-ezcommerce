import { render, screen } from '@testing-library/react';
import { CardFavourite } from '../../../src/components/Epica04/CardFavourite';

describe('CardFavourite', () => {
  it('renderiza la información del producto favorito', () => {
    render(<CardFavourite />);
    expect(screen.getByText('Audifonos Sony')).toBeInTheDocument();
    expect(screen.getByText('S/ 34.00')).toBeInTheDocument();
    expect(screen.getByText('Marca')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar/i })).toBeInTheDocument();
  });

  it('renderiza los íconos', () => {
    render(<CardFavourite />);
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // SVG icons
  });
});
