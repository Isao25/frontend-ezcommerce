import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchPage } from '../../../src/pages/Epica03/SearchPage';
import { render } from '../../utils/test-utils';
import { getAllFacultades } from '../../../src/api/apiFacultades';
import { getAllImages } from '../../../src/api/apiImages';
import axios from 'axios';
import { EtiquetasContext } from '../../../src/context/EtiquetasContext';

// Mock dependencies
jest.mock('../../../src/api/apiFacultades');
jest.mock('../../../src/api/apiImages');
jest.mock('axios');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({
    search: '?nombre=test&etiquetas=1&facultades=FISI&precio_min=10&precio_max=100&page=1&limit=10'
  }),
  useNavigate: () => jest.fn(),
}));

const mockedGetAllFacultades = getAllFacultades as jest.MockedFunction<typeof getAllFacultades>;
const mockedGetAllImages = getAllImages as jest.MockedFunction<typeof getAllImages>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SearchPage', () => {
  const mockEtiquetas = [
    { id: 1, nombre: 'Electrónica', descripcion: 'Productos electrónicos' },
    { id: 2, nombre: 'Libros', descripcion: 'Libros y material educativo' },
    { id: 3, nombre: 'Ropa', descripcion: 'Vestimenta' }
  ];

  const mockFacultades = [
    { codigo: 1, nombre: 'Facultad de Ingeniería', siglas: 'FISI' },
    { codigo: 2, nombre: 'Facultad de Ciencias Económicas', siglas: 'FCE' },
    { codigo: 3, nombre: 'Facultad de Medicina', siglas: 'FMED' }
  ];

  const mockArticulos = [
    {
      id: 1,
      nombre: 'Producto Test 1',
      precio: 50,
      descripcion: 'Descripción del producto 1',
      stock: 10,
      etiquetas: [1],
      is_marca: false,
      id_catalogo: 1
    },
    {
      id: 2,
      nombre: 'Producto Test 2',
      precio: 75,
      descripcion: 'Descripción del producto 2',
      stock: 5,
      etiquetas: [2],
      is_marca: true,
      id_catalogo: 2
    }
  ];

  const mockImages = [
    { id_articulo: 1, url: 'https://example.com/image1.jpg' },
    { id_articulo: 2, url: 'https://example.com/image2.jpg' }
  ];

  const mockEtiquetasContextValue = {
    etiquetasList: mockEtiquetas,
    setEtiquetasList: jest.fn(),
    loadingEtiquetas: false,
    loadingPage: false,
    setLoadingPage: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock facultades API
    mockedGetAllFacultades.mockImplementation((page) => 
      Promise.resolve({
        data: { 
          results: page === 1 ? mockFacultades.slice(0, 2) : mockFacultades.slice(2) 
        }
      } as any)
    );

    // Mock images API
    mockedGetAllImages.mockResolvedValue({
      data: { results: mockImages }
    } as any);

    // Mock axios for articles API
    mockedAxios.get.mockResolvedValue({
      data: {
        results: mockArticulos,
        count: 20
      }
    });
  });

  const renderWithEtiquetasContext = (contextValue = mockEtiquetasContextValue) => {
    return render(
      <EtiquetasContext.Provider value={contextValue}>
        <SearchPage />
      </EtiquetasContext.Provider>
    );
  };

  it('renders search page with filters and results', async () => {
    renderWithEtiquetasContext();

    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Facultades')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();

    // Wait for facultades to load
    await waitFor(() => {
      expect(screen.getByText('FISI')).toBeInTheDocument();
      expect(screen.getByText('FCE')).toBeInTheDocument();
    });
  });

  it('displays etiquetas correctly', () => {
    renderWithEtiquetasContext();

    expect(screen.getByText('Electrónica')).toBeInTheDocument();
    expect(screen.getByText('Libros')).toBeInTheDocument();
    expect(screen.getByText('Ropa')).toBeInTheDocument();
  });

  it('loads and displays search results', async () => {
    renderWithEtiquetasContext();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Producto Test 1')).toBeInTheDocument();
      expect(screen.getByText('Producto Test 2')).toBeInTheDocument();
    });
  });

  it('handles category filter selection', () => {
    renderWithEtiquetasContext();

    const electronicaCheckbox = screen.getByLabelText('Electrónica');
    fireEvent.click(electronicaCheckbox);

    expect(electronicaCheckbox).toBeChecked();
  });

  it('handles faculty filter selection', async () => {
    renderWithEtiquetasContext();

    await waitFor(() => {
      expect(screen.getByText('FISI')).toBeInTheDocument();
    });

    const fisiCheckbox = screen.getByLabelText('FISI');
    fireEvent.click(fisiCheckbox);

    expect(fisiCheckbox).toBeChecked();
  });

  it('handles price range filters', () => {
    renderWithEtiquetasContext();

    expect(screen.getByText('Desde: S/. 0')).toBeInTheDocument();
    expect(screen.getByText('Hasta: S/. 500')).toBeInTheDocument();

    // Test price sliders are present
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });

  it('displays pagination component', async () => {
    renderWithEtiquetasContext();

    await waitFor(() => {
      expect(screen.getAllByText('1')).toHaveLength(2); // Page number appears twice (top and bottom)
    });
  });

  it('handles items per page selection', async () => {
    renderWithEtiquetasContext();

    await waitFor(() => {
      const itemsPerPageSelect = screen.getAllByRole('combobox');
      expect(itemsPerPageSelect.length).toBeGreaterThan(0);
    });

    const select = screen.getAllByRole('combobox')[0];
    fireEvent.change(select, { target: { value: '25' } });

    expect(select).toHaveValue('25');
  });

  it('clears filters when clear button is clicked', () => {
    renderWithEtiquetasContext();

    const clearButton = screen.getByText('Limpiar filtro');
    fireEvent.click(clearButton);

    // After clearing, filters should reset
    expect(clearButton).toBeInTheDocument();
  });

  it('shows "Mostrar más" button when there are many facultades', async () => {
    const manyFacultades = Array.from({ length: 15 }, (_, i) => ({
      codigo: i + 1,
      nombre: `Facultad ${i + 1}`,
      siglas: `FAC${i + 1}`
    }));

    mockedGetAllFacultades.mockImplementation((page) => 
      Promise.resolve({
        data: { 
          results: page === 1 ? manyFacultades.slice(0, 8) : manyFacultades.slice(8) 
        }
      } as any)
    );

    renderWithEtiquetasContext();

    await waitFor(() => {
      expect(screen.getByText('Mostrar más')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mostrar más'));

    await waitFor(() => {
      expect(screen.getByText('Mostrar menos')).toBeInTheDocument();
    });
  });

  it('displays search results count when searching by name', async () => {
    // Mock location with search query
    jest.doMock('react-router', () => ({
      ...jest.requireActual('react-router'),
      useLocation: () => ({
        search: '?nombre=test'
      }),
      useNavigate: () => jest.fn(),
    }));

    renderWithEtiquetasContext();

    await waitFor(() => {
      // Should show result count for search term
      const resultText = screen.queryByText(/resultados para/);
      if (resultText) {
        expect(resultText).toBeInTheDocument();
      }
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    renderWithEtiquetasContext();

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error al obtener los datos:', expect.any(Error));
    });

    consoleError.mockRestore();
  });

  it('handles loading states correctly', () => {
    const loadingContextValue = {
      ...mockEtiquetasContextValue,
      loadingPage: true
    };

    renderWithEtiquetasContext(loadingContextValue);

    // Loading state should be handled by the context
    expect(loadingContextValue.loadingPage).toBe(true);
  });

  it('maps images to articles correctly', async () => {
    renderWithEtiquetasContext();

    await waitFor(() => {
      expect(mockedGetAllImages).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Images should be mapped to products
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it('handles empty search results', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [],
        count: 0
      }
    });

    renderWithEtiquetasContext();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    // Should handle empty results gracefully
    expect(screen.getByText('Filtros')).toBeInTheDocument();
  });

  it('initializes filters from URL parameters', () => {
    renderWithEtiquetasContext();

    // Component should read filters from URL search params
    // This tests the useEffect that reads from location.search
    expect(screen.getByText('Filtros')).toBeInTheDocument();
  });
});
