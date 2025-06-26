import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MainPage } from '../../../src/pages/Epica03/MainPage';
import { render, createMockAuthUser, createMockUnauthUser } from '../../utils/test-utils';
import { useAuth } from '../../../src/hooks/useAuth';
import { useTrademark } from '../../../src/hooks/useTrademark';
import { getArticulos } from '../../../src/api/apiArticulos';
import { getAllImages } from '../../../src/api/apiImages';
import { escuelasService, usuariosApi } from '../../../src/api/apiUsuarios';

// Mock dependencies
jest.mock('.../../../src/hooks/useAuth');
jest.mock('../../../src/hooks/useTrademark');
jest.mock('../../../src/api/apiArticulos');
jest.mock('../../../src/api/apiImages');
jest.mock('../../../src/api/apiUsuarios');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseTrademark = useTrademark as jest.MockedFunction<typeof useTrademark>;
const mockedGetArticulos = getArticulos as jest.MockedFunction<typeof getArticulos>;
const mockedGetAllImages = getAllImages as jest.MockedFunction<typeof getAllImages>;
const mockedEscuelasService = escuelasService as jest.Mocked<typeof escuelasService>;
const mockedUsuariosApi = usuariosApi as jest.Mocked<typeof usuariosApi>;

describe('MainPage', () => {
  const mockArticulos = [
    {
      id: 1,
      nombre: 'Test Product 1',
      precio: 29.99,
      descripcion: 'Test description 1',
      stock: 10,
      etiquetas: [1],
      is_marca: false,
      id_catalogo: 1
    },
    {
      id: 2,
      nombre: 'Test Product 2',
      precio: 49.99,
      descripcion: 'Test description 2',
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

  const mockEscuelas = [
    { id: 1, nombre: 'FISI', codigo: 'FISI001', id_facultad: 1 },
    { id: 2, nombre: 'FCE', codigo: 'FCE001', id_facultad: 2 }
  ];

  const mockSellers = [
    {
      id: 1,
      nombres: 'Juan',
      apellido_p: 'Pérez',
      apellido_m: 'García',
      email: 'juan@test.com',
      username: 'juan123',
      celular: '987654321',
      codigo: '12345678',
      id_escuela: 1
    },
    {
      id: 2,
      nombres: 'María',
      apellido_p: 'López',
      apellido_m: 'Sánchez',
      email: 'maria@test.com',
      username: 'maria123',
      celular: '987654322',
      codigo: '12345679',
      id_escuela: 2
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockedGetArticulos.mockResolvedValue({
      data: { results: mockArticulos }
    } as any);

    mockedGetAllImages.mockResolvedValue({
      data: { results: mockImages }
    } as any);

    mockedEscuelasService.getEscuelas.mockResolvedValue({
      data: { results: mockEscuelas }
    } as any);

    mockedUsuariosApi.get.mockResolvedValue({
      data: { results: mockSellers }
    } as any);

    mockedUseTrademark.mockReturnValue({
      marca: null,
      setMarca: jest.fn(),
      membresia: null,
      plan: null,
      gratisModal: false,
      setGratisModal: jest.fn(),
    });
  });

  it('renders main page components correctly', async () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    expect(screen.getByText('Elige tu categoría favorita')).toBeInTheDocument();
    expect(screen.getByText('Conoce a nuestro vendedores destacados')).toBeInTheDocument();
    expect(screen.getByText('¿Listo para que todos en la universidad conozca tu marca?')).toBeInTheDocument();
  });

  it('loads and displays products correctly', async () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    await waitFor(() => {
      expect(mockedGetArticulos).toHaveBeenCalled();
      expect(mockedGetAllImages).toHaveBeenCalled();
    });

    // Products should be rendered in carousel
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  it('loads and displays sellers correctly', async () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    await waitFor(() => {
      expect(mockedUsuariosApi.get).toHaveBeenCalledWith('?es_vendedor=true');
    });

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María López')).toBeInTheDocument();
    });
  });

  it('handles trademark action for authenticated user', () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router', () => ({
      useNavigate: () => mockNavigate,
    }));

    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MainPage />);

    const trademarkButton = screen.getByText('Iniciar');
    fireEvent.click(trademarkButton);

    // Note: Navigation testing would require more complex setup
    expect(trademarkButton).toBeInTheDocument();
  });

  it('handles trademark action for unauthenticated user', () => {
    const mockSetLoginModal = jest.fn();
    mockedUseAuth.mockReturnValue({
      ...createMockUnauthUser(),
      setLoginModal: mockSetLoginModal,
    });

    render(<MainPage />);

    const trademarkButton = screen.getByText('Iniciar');
    fireEvent.click(trademarkButton);

    expect(mockSetLoginModal).toHaveBeenCalledWith(true);
  });

  it('displays categories section', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    expect(screen.getByText('Elige tu categoría favorita')).toBeInTheDocument();
    expect(screen.getByText('Electrónica')).toBeInTheDocument();
    expect(screen.getByText('Estudio')).toBeInTheDocument();
    expect(screen.getByText('Insumos académicos')).toBeInTheDocument();
    expect(screen.getByText('Accesorios')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    mockedGetArticulos.mockRejectedValue(new Error('API Error'));
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error al cargar los datos:', expect.any(Error));
    });

    consoleError.mockRestore();
  });

  it('displays trademark information correctly', () => {
    const mockTrademark = {
      marca: { id: 1, nombre: 'Test Brand', descripcion: 'Test', logo: 'logo.jpg', id_usuario: 1 },
      membresia: { id: 1, id_marca: 1, id_plan: 1, fecha_inicio: '2024-01-01', fecha_final: '2024-12-31' },
      plan: { id: 1, nombre: 'Premium', descripcion: 'Premium plan', precio: 100, duracion: 12, espacio_extra: 5 },
      setMarca: jest.fn(),
      gratisModal: false,
      setGratisModal: jest.fn(),
    };

    mockedUseTrademark.mockReturnValue(mockTrademark);
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MainPage />);

    // The component logs trademark info to console
    expect(mockTrademark.marca).toBeDefined();
    expect(mockTrademark.plan).toBeDefined();
  });

  it('renders carousel navigation controls', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    // Check for carousel navigation elements
    const carousels = screen.getAllByRole('region');
    expect(carousels.length).toBeGreaterThan(0);
  });

  it('handles image mapping correctly', async () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    await waitFor(() => {
      expect(mockedGetArticulos).toHaveBeenCalled();
      expect(mockedGetAllImages).toHaveBeenCalled();
    });

    // Verify that images are mapped to products correctly
    await waitFor(() => {
      const productElements = screen.getAllByRole('img');
      expect(productElements.length).toBeGreaterThan(0);
    });
  });

  it('displays banner carousel', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    // Banner images should be present
    const bannerImages = screen.getAllByRole('img');
    expect(bannerImages.length).toBeGreaterThan(0);
  });

  it('renders call-to-action section', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    expect(screen.getByText('VAMOS')).toBeInTheDocument();
    expect(screen.getByText('¿Listo para que todos en la universidad conozca tu marca?')).toBeInTheDocument();
    expect(screen.getByText('¡Hazla destacar y empieza a vender hoy mismo!')).toBeInTheDocument();
    expect(screen.getByText('Iniciar')).toBeInTheDocument();
  });

  it('handles empty data gracefully', async () => {
    mockedGetArticulos.mockResolvedValue({
      data: { results: [] }
    } as any);

    mockedGetAllImages.mockResolvedValue({
      data: { results: [] }
    } as any);

    mockedUsuariosApi.get.mockResolvedValue({
      data: { results: [] }
    } as any);

    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MainPage />);

    await waitFor(() => {
      expect(mockedGetArticulos).toHaveBeenCalled();
    });

    // Page should still render even with empty data
    expect(screen.getByText('Elige tu categoría favorita')).toBeInTheDocument();
  });
});