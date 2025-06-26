import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CardPublishedEdit } from '@/components/Epica04/CardPublishedEdit';
import { BrowserRouter } from 'react-router-dom';

// Mock the helpers and API
jest.mock('@/helpers/getImageMajor', () => ({
  LoadImageMajor: jest.fn()
}));

jest.mock('@/api/apiArticulos', () => ({
  deleteArticulo: jest.fn()
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CardPublishedEdit', () => {
  const mockProduct = {
    id: 1,
    nombre: 'Test Product',
    precio: 99.99,
    rating: 4.5
  };

  const mockOnProductDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock LoadImageMajor
    const { LoadImageMajor } = require('@/helpers/getImageMajor');
    LoadImageMajor.mockResolvedValue([
      { url: 'test-image.jpg' }
    ]);
  });

  test('renders product information correctly', async () => {
    renderWithRouter(
      <CardPublishedEdit 
        product={mockProduct} 
        onProductDeleted={mockOnProductDeleted} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('S/ 99.99')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    renderWithRouter(
      <CardPublishedEdit 
        product={mockProduct} 
        onProductDeleted={mockOnProductDeleted} 
      />
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('shows default image when no image available', async () => {
    const { LoadImageMajor } = require('@/helpers/getImageMajor');
    LoadImageMajor.mockResolvedValue([]);

    renderWithRouter(
      <CardPublishedEdit 
        product={mockProduct} 
        onProductDeleted={mockOnProductDeleted} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    });
  });

  test('handles edit button click', async () => {
    renderWithRouter(
      <CardPublishedEdit 
        product={mockProduct} 
        onProductDeleted={mockOnProductDeleted} 
      />
    );

    await waitFor(() => {
      const editLink = screen.getByRole('link');
      expect(editLink).toHaveAttribute('href', '/edit-product/1');
    });
  });

  test('handles delete functionality', async () => {
    const { deleteArticulo } = require('@/api/apiArticulos');
    deleteArticulo.mockResolvedValue({});

    renderWithRouter(
      <CardPublishedEdit 
        product={mockProduct} 
        onProductDeleted={mockOnProductDeleted} 
      />
    );

    await waitFor(() => {
      const deleteButton = screen.getByText('Eliminar');
      fireEvent.click(deleteButton);
    });

    // Should open delete modal
    await waitFor(() => {
      expect(screen.getByText('Eliminar producto')).toBeInTheDocument();
    });

    // Click accept button
    const acceptButton = screen.getByText('Aceptar');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(deleteArticulo).toHaveBeenCalledWith(1);
      expect(mockOnProductDeleted).toHaveBeenCalledWith(1);
    });
  });
});
