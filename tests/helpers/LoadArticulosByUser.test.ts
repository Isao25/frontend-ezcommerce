import { LoadArticulosByUser } from '@/helpers/LoadArticulosByUser';

// Mock constants
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock the API
jest.mock('@/api/apiArticulos', () => ({
  getArticulosByUsuario: jest.fn()
}));

import { getArticulosByUsuario } from '@/api/apiArticulos';
const mockedGetArticulosByUsuario = getArticulosByUsuario as jest.MockedFunction<typeof getArticulosByUsuario>;

describe('LoadArticulosByUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getArticulosByUsuario with correct parameters', async () => {
    const mockResponse = {
      data: {
        results: [
          { id: 1, nombre: 'Artículo 1', descripcion: 'Desc 1' },
          { id: 2, nombre: 'Artículo 2', descripcion: 'Desc 2' }
        ]
      }
    };

    mockedGetArticulosByUsuario.mockResolvedValue(mockResponse as any);

    const result = await LoadArticulosByUser(1, 1);

    expect(mockedGetArticulosByUsuario).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors from API', async () => {
    const error = new Error('API Error');
    mockedGetArticulosByUsuario.mockRejectedValue(error);

    await expect(LoadArticulosByUser(1, 1)).rejects.toThrow('API Error');
    expect(mockedGetArticulosByUsuario).toHaveBeenCalledWith(1, 1);
  });

  it('should work with different user and page parameters', async () => {
    const mockResponse = {
      data: { results: [] }
    };

    mockedGetArticulosByUsuario.mockResolvedValue(mockResponse as any);

    await LoadArticulosByUser(99, 5);

    expect(mockedGetArticulosByUsuario).toHaveBeenCalledWith(99, 5);
  });
});
