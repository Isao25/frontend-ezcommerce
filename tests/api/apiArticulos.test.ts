// Mock constants ANTES de importar
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

import axios from 'axios';
import {
  getArticulos,
  createArticulo,
  updateArticulo,
  deleteArticulo,
  getArticulo,
  getArticulosByUsuario,
  Articulo
} from '@/api/apiArticulos';

// Mock axios completamente
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => '{}'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Articulos API', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };

  const mockArticulo: Articulo = {
    id: 1,
    nombre: 'Test Product',
    descripcion: 'Test Description',
    precio: 100,
    stock: 10,
    etiquetas: [1, 2],
    is_marca: false,
    id_catalogo: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  describe('getArticulos', () => {
    it('should fetch all articulos', async () => {
      const mockResponse = { data: { results: [mockArticulo] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getArticulos();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/');
      expect(result.data.results).toEqual([mockArticulo]);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('API Error'));
      await expect(getArticulos()).rejects.toThrow('API Error');
    });
  });

  describe('createArticulo', () => {
    it('should create new articulo', async () => {
      const mockResponse = { data: mockArticulo };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      
      const result = await createArticulo(mockArticulo);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/', mockArticulo);
      expect(result.data).toEqual(mockArticulo);
    });
  });

  describe('updateArticulo', () => {
    it('should update existing articulo', async () => {
      const mockResponse = { data: mockArticulo };
      mockAxiosInstance.put.mockResolvedValue(mockResponse);
      
      const result = await updateArticulo(1, mockArticulo);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/1', mockArticulo);
      expect(result.data).toEqual(mockArticulo);
    });
  });

  describe('deleteArticulo', () => {
    it('should delete articulo', async () => {
      const mockResponse = { data: { message: 'Deleted' } };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
      
      const result = await deleteArticulo(1);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/1');
      expect(result.data.message).toBe('Deleted');
    });
  });

  describe('getArticulo', () => {
    it('should fetch single articulo', async () => {
      const mockResponse = { data: mockArticulo };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getArticulo(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/1');
      expect(result.data).toEqual(mockArticulo);
    });
  });

  describe('getArticulosByUsuario', () => {
    it('should fetch articulos by user', async () => {
      const mockResponse = { data: { results: [mockArticulo] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getArticulosByUsuario(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/?id_usuario=1');
      expect(result.data.results).toEqual([mockArticulo]);
    });
  });
});
