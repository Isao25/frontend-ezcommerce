import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { FavouritesProvider, useFavouritesContext } from '@/context/FavouritesContext';
import { toast } from 'sonner';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

// Test component to use the context
const TestComponent = () => {
  const { favourites, toggleFavourite } = useFavouritesContext();
  
  return (
    <div>
      <div data-testid="favourites-count">{favourites.length}</div>
      <div data-testid="favourites-list">{favourites.join(',')}</div>
      <button 
        data-testid="toggle-favourite-1" 
        onClick={() => toggleFavourite(1)}
      >
        Toggle 1
      </button>
      <button 
        data-testid="toggle-favourite-2" 
        onClick={() => toggleFavourite(2)}
      >
        Toggle 2
      </button>
    </div>
  );
};

describe('FavouritesContext', () => {
  beforeEach(() => {
    // Reset localStorage mock
    jest.clearAllMocks();
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
  });

  it('initializes with empty favourites when localStorage is empty', () => {
    render(
      <FavouritesProvider>
        <TestComponent />
      </FavouritesProvider>
    );

    expect(screen.getByTestId('favourites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('favourites-list')).toHaveTextContent('');
  });

  it('initializes with favourites from localStorage', () => {
    // Mock localStorage to return saved favourites
    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([1, 2, 3]));

    render(
      <FavouritesProvider>
        <TestComponent />
      </FavouritesProvider>
    );

    expect(screen.getByTestId('favourites-count')).toHaveTextContent('3');
    expect(screen.getByTestId('favourites-list')).toHaveTextContent('1,2,3');
  });

  it('adds favourite and shows success toast', () => {
    render(
      <FavouritesProvider>
        <TestComponent />
      </FavouritesProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('toggle-favourite-1'));
    });

    expect(screen.getByTestId('favourites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favourites-list')).toHaveTextContent('1');
    expect(toast.success).toHaveBeenCalledWith('Producto añadido a favoritos.');
  });

  it('removes favourite and shows info toast', () => {
    // Start with favourites in localStorage
    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([1, 2]));

    render(
      <FavouritesProvider>
        <TestComponent />
      </FavouritesProvider>
    );

    // Remove favourite 1
    act(() => {
      fireEvent.click(screen.getByTestId('toggle-favourite-1'));
    });

    expect(screen.getByTestId('favourites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favourites-list')).toHaveTextContent('2');
    expect(toast.info).toHaveBeenCalledWith('Se eliminó de favoritos.');
  });

  it('persists favourites to localStorage', () => {
    render(
      <FavouritesProvider>
        <TestComponent />
      </FavouritesProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('toggle-favourite-1'));
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'favourites', 
      JSON.stringify([1])
    );
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFavouritesContext debe usarse dentro de FavouritesProvider');

    // Restore console.error
    console.error = originalError;
  });
});