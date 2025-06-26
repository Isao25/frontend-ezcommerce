import { CategoriesCard } from '../../../src/components/cards';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock del hook useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

// Componente wrapper para las pruebas
export const renderWithRouter = (component: ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CategoriesCard', () => {
  const defaultProps = {
    id: 'categoria-1',
    image: 'https://example.com/image.jpg',
    title: 'Título de Prueba',
    description: 'Esta es una descripción de prueba para el componente',
    horiz: false,
    index: 0
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renderiza correctamente con props básicas', () => {
    renderWithRouter(<CategoriesCard {...defaultProps} />);
    
    expect(screen.getByText('Título de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Esta es una descripción de prueba para el componente')).toBeInTheDocument();
    expect(screen.getByAltText('Título de Prueba')).toBeInTheDocument();
  });

  test('renderiza la imagen con src y alt correctos', () => {
    renderWithRouter(<CategoriesCard {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Título de Prueba');
  });

  test('navega correctamente cuando se hace clic', () => {
    renderWithRouter(<CategoriesCard {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?etiquetas=categoria-1');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('aplica clases CSS correctas para layout horizontal', () => {
    const horizProps = { ...defaultProps, horiz: true, index: 1 };
    renderWithRouter(<CategoriesCard {...horizProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('lg:col-span-2', 'lg:row-start-1', 'lg:col-start-2');
    expect(button).toHaveClass('lg:flex-row');
  });

  test('aplica clases CSS correctas para layout vertical', () => {
    const vertProps = { ...defaultProps, horiz: false, index: 2 };
    renderWithRouter(<CategoriesCard {...vertProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('lg:row-span-2', 'lg:col-start-3', 'lg:row-start-1');
    expect(button).toHaveClass('lg:flex-col');
  });

  test('renderiza como un botón clickeable', () => {
    renderWithRouter(<CategoriesCard {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('rounded-lg', 'shadow-lg', 'border-slate-400');
  });

  test('maneja diferentes índices correctamente', () => {
    const props1 = { ...defaultProps, horiz: false, index: 0 };
    const props2 = { ...defaultProps, horiz: false, index: 3 };
    
    const { rerender } = renderWithRouter(<CategoriesCard {...props1} />);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('lg:col-start-1');
    
    rerender(<BrowserRouter><CategoriesCard {...props2} /></BrowserRouter>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('lg:col-start-4');
  });

  test('maneja diferentes IDs para navegación', () => {
    const customProps = { ...defaultProps, id: 'categoria-especial' };
    renderWithRouter(<CategoriesCard {...customProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?etiquetas=categoria-especial');
  });

  // Test de accesibilidad
  test('tiene la estructura de accesibilidad correcta', () => {
    renderWithRouter(<CategoriesCard {...defaultProps} />);
    
    // Debe tener un botón como elemento principal
    expect(screen.getByRole('button')).toBeInTheDocument();
    
    // La imagen debe tener texto alternativo
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
    expect(image.getAttribute('alt')).toBeTruthy();
  });

  // Test de snapshot para detectar cambios no intencionados
  test('coincide con el snapshot', () => {
    const { container } = renderWithRouter(<CategoriesCard {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});