import axios from 'axios';
import { getArticulos, createArticulo, deleteArticulo } from '@/api/apiArticulos';
import * as apiArticulos from '@/api/apiArticulos';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

describe('apiArticulos', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };

  beforeEach(() => {
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    jest.clearAllMocks();
  });

  test('getArticulos calls api correctly', async () => {
    const mockData = { data: { results: [] } };
    mockAxiosInstance.get.mockResolvedValue(mockData);

    const result = await getArticulos();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/');
    expect(result).toEqual(mockData);
  });

  test('createArticulo calls api correctly', async () => {
    const mockArticulo = {
      id: 1,
      nombre: 'Test',
      descripcion: 'Test desc',
      precio: 100,
      stock: 10,
      etiquetas: [1],
      is_marca: false,
      id_catalogo: 1
    };
    const mockResponse = { data: mockArticulo };
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const result = await createArticulo(mockArticulo);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/', mockArticulo);
    expect(result).toEqual(mockResponse);
  });

  test('deleteArticulo calls api correctly', async () => {
    const mockResponse = { data: {} };
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const result = await deleteArticulo(1);

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/1/');
    expect(result).toEqual(mockResponse);
  });
});


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
const localStorageMock = {
  getItem: jest.fn(() => JSON.stringify({ access: 'fake-token' })),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('apiArticulos', () => {
  // Obtener la instancia mockeada de axios
  const axios = require('axios');
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

  beforeEach(() => {
    axios.create.mockReturnValue(mockAxiosInstance);
    jest.clearAllMocks();
  });

  test('getArticulos calls api correctly', async () => {
    const mockData = { data: { results: [] } };
    mockAxiosInstance.get.mockResolvedValue(mockData);

    const result = await apiArticulos.getArticulos();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/');
    expect(result).toEqual(mockData);
  });

  test('createArticulo calls api correctly', async () => {
    const mockArticulo = {
      id: 1,
      nombre: 'Test',
      descripcion: 'Test desc',
      precio: 100,
      stock: 10,
      etiquetas: [1],
      is_marca: false,
      id_catalogo: 1
    };
    const mockResponse = { data: mockArticulo };
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const result = await apiArticulos.createArticulo(mockArticulo);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/', mockArticulo);
    expect(result).toEqual(mockResponse);
  });

  test('deleteArticulo calls api correctly', async () => {
    const mockResponse = { data: {} };
    mockAxiosInstance.delete.mockResolvedValue(mockResponse);

    const result = await apiArticulos.deleteArticulo(1);

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/1/');
    expect(result).toEqual(mockResponse);
  });
});