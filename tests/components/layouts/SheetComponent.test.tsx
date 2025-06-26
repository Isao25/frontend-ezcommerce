// ============================================

// tests/components/layouts/SheetComponent.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SheetComponent } from '@/components/layouts/SheetComponent';
import { getEtiquetas } from '@/api/apiEtiquetas';
import * as router from 'react-router';

jest.mock('@/api/apiEtiquetas');
const mockGetEtiquetas = getEtiquetas as jest.MockedFunction<typeof getEtiquetas>;
const mockNavigate = jest.fn();

jest.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SheetComponent', () => {
  const mockEtiquetas = [
    { id: 1, nombre: 'Electrónicos', descripcion: 'Dispositivos electrónicos' },
    { id: 2, nombre: 'Ropa', descripcion: 'Vestimenta' },
    { id: 3, nombre: 'Libros', descripcion: 'Literatura y textos' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetEtiquetas.mockResolvedValue({
      data: { results: mockEtiquetas }
    } as any);
  });

  it('renders sheet trigger button', () => {
    renderWithRouter(<SheetComponent />);
    
    expect(screen.getByText('Categorías')).toBeInTheDocument();
  });

  it('opens sheet when trigger is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(screen.getByText('Selecciona una categoría para navegar por los productos.')).toBeInTheDocument();
    });
  });

  it('fetches and displays etiquetas', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(mockGetEtiquetas).toHaveBeenCalled();
      expect(screen.getByText('Electrónicos')).toBeInTheDocument();
      expect(screen.getByText('Ropa')).toBeInTheDocument();
      expect(screen.getByText('Libros')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching etiquetas', async () => {
    mockGetEtiquetas.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(screen.getByText('Cargando categorías...')).toBeInTheDocument();
    });
  });

  it('shows error state when fetch fails', async () => {
    mockGetEtiquetas.mockRejectedValue(new Error('Network error'));
    
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar las categorías.')).toBeInTheDocument();
    });
  });

  it('navigates to category when clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(screen.getByText('Electrónicos')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Electrónicos'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?etiquetas=1');
  });

  it('shows message when no etiquetas available', async () => {
    mockGetEtiquetas.mockResolvedValue({
      data: { results: [] }
    } as any);
    
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(screen.getByText('No hay categorías disponibles.')).toBeInTheDocument();
    });
  });

  it('closes sheet when category is selected', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(screen.getByText('Electrónicos')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Electrónicos'));
    
    // Sheet should close (component unmounts the content)
    await waitFor(() => {
      expect(screen.queryByText('Selecciona una categoría para navegar por los productos.')).not.toBeInTheDocument();
    });
  });

  it('handles console error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetEtiquetas.mockRejectedValue(new Error('API Error'));
    
    const user = userEvent.setup();
    renderWithRouter(<SheetComponent />);
    
    await user.click(screen.getByText('Categorías'));
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener las etiquetas:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});
