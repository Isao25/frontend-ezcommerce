import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModalDeleteProduct } from '@/components/Epica04/ModalDeleteProduct';

// Mock the API
jest.mock('@/api/apiArticulos', () => ({
  deleteArticulo: jest.fn()
}));

describe('ModalDeleteProduct', () => {
  const mockOnDeleteSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders delete button', () => {
    render(
      <ModalDeleteProduct 
        productId={1} 
        onDeleteSuccess={mockOnDeleteSuccess} 
      />
    );

    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  test('opens modal when delete button clicked', () => {
    render(
      <ModalDeleteProduct 
        productId={1} 
        onDeleteSuccess={mockOnDeleteSuccess} 
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));

    expect(screen.getByText('Eliminar producto')).toBeInTheDocument();
    expect(screen.getByText(/¿Está seguro de que desea eliminar este producto?/)).toBeInTheDocument();
  });

  test('closes modal when cancel is clicked', () => {
    render(
      <ModalDeleteProduct 
        productId={1} 
        onDeleteSuccess={mockOnDeleteSuccess} 
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    fireEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByText('Eliminar producto')).not.toBeInTheDocument();
  });

  test('handles successful deletion', async () => {
    const { deleteArticulo } = require('@/api/apiArticulos');
    deleteArticulo.mockResolvedValue({});

    render(
      <ModalDeleteProduct 
        productId={1} 
        onDeleteSuccess={mockOnDeleteSuccess} 
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    
    const acceptButton = screen.getByText('Aceptar');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(deleteArticulo).toHaveBeenCalledWith(1);
      expect(mockOnDeleteSuccess).toHaveBeenCalled();
    });
  });

  test('handles deletion error', async () => {
    const { deleteArticulo } = require('@/api/apiArticulos');
    deleteArticulo.mockRejectedValue(new Error('Delete failed'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <ModalDeleteProduct 
        productId={1} 
        onDeleteSuccess={mockOnDeleteSuccess} 
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    
    const acceptButton = screen.getByText('Aceptar');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(screen.getByText(/Hubo un problema al intentar eliminar el producto/)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('shows loading state during deletion', async () => {
    const { deleteArticulo } = require('@/api/apiArticulos');
    deleteArticulo.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <ModalDeleteProduct 
        productId={1} 
        onDeleteSuccess={mockOnDeleteSuccess} 
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    
    const acceptButton = screen.getByText('Aceptar');
    fireEvent.click(acceptButton);

    expect(screen.getByText('Eliminando...')).toBeInTheDocument();
  });
});
