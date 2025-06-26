import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { FavouritesProvider, useFavouritesContext } from '../../src/context/FavouritesContext';
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
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
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
    localStorage.setItem('favourites', JSON.stringify([1, 2, 3]));

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
    localStorage.setItem('favourites', JSON.stringify([1, 2]));

    render(
      <FavouritesProvider>
        <TestComponent />
      </FavouritesProvider>
    );

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
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFavouritesContext debe usarse dentro de FavouritesProvider');

    consoleError.mockRestore();
  });
});