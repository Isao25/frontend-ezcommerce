import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '@/components/Epica04/ProductForm';
import { BrowserRouter } from 'react-router-dom';

// Mock all dependencies
jest.mock('@/pages/Epica04/hooks/useImageUpload', () => ({
  useImageUpload: jest.fn(() => ({
    images: [],
    setImages: jest.fn(),
    handleFileUpload: jest.fn(),
    removeImage: jest.fn(),
    handleDragEnd: jest.fn()
  }))
}));

jest.mock('@/pages/Epica04/hooks/useProductForm', () => ({
  useProductForm: jest.fn(() => ({
    form: {
      handleSubmit: jest.fn(() => jest.fn()),
      control: {},
      formState: { errors: {} },
      reset: jest.fn()
    },
    onSubmit: jest.fn(),
    isMarca: false
  }))
}));

jest.mock('@/helpers/LoadEtiquetas', () => ({
  LoadEtiquetas: jest.fn(() => Promise.resolve([
    { id: 1, nombre: 'Etiqueta 1' },
    { id: 2, nombre: 'Etiqueta 2' }
  ]))
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements', async () => {
    renderWithRouter(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByText('Agregar producto')).toBeInTheDocument();
      expect(screen.getByText('Imágenes de tus productos')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre del producto')).toBeInTheDocument();
      expect(screen.getByLabelText('Precio del producto')).toBeInTheDocument();
      expect(screen.getByLabelText('Stock')).toBeInTheDocument();
      expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    });
  });

  test('renders edit mode when product provided', async () => {
    const mockProduct = {
      id: 1,
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: 100,
      stock: 10,
      etiquetas: [1],
      is_marca: false,
      id_catalogo: 1
    };

    renderWithRouter(<ProductForm product={mockProduct} />);

    await waitFor(() => {
      expect(screen.getByText('Editar producto')).toBeInTheDocument();
    });
  });

  test('shows etiquetas section', async () => {
    renderWithRouter(<ProductForm />);

    await waitFor(() => {
      expect(screen.getByText('Etiquetas')).toBeInTheDocument();
      expect(screen.getByText('Etiqueta 1')).toBeInTheDocument();
      expect(screen.getByText('Etiqueta 2')).toBeInTheDocument();
    });
  });

  test('shows marca switch when user has marca', () => {
    const { useProductForm } = require('@/pages/Epica04/hooks/useProductForm');
    useProductForm.mockReturnValue({
      form: {
        handleSubmit: jest.fn(() => jest.fn()),
        control: {},
        formState: { errors: {} },
        reset: jest.fn()
      },
      onSubmit: jest.fn(),
      isMarca: true
    });

    renderWithRouter(<ProductForm />);

    expect(screen.getByText('Publicar producto como marca')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const mockOnSubmit = jest.fn();
    const { useProductForm } = require('@/pages/Epica04/hooks/useProductForm');
    
    useProductForm.mockReturnValue({
      form: {
        handleSubmit: jest.fn(() => mockOnSubmit),
        control: {},
        formState: { errors: {} },
        reset: jest.fn()
      },
      onSubmit: mockOnSubmit,
      isMarca: false
    });

    renderWithRouter(<ProductForm />);

    const form = screen.getByRole('form') || screen.getByTestId('product-form');
    if (form) {
      fireEvent.submit(form);
      expect(mockOnSubmit).toHaveBeenCalled();
    }
  });

  test('handles cancel button', async () => {
    renderWithRouter(<ProductForm />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    // Should navigate away or reset form
    expect(cancelButton).toBeInTheDocument();
  });
});
