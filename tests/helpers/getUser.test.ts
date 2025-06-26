import { LoadUsuarios } from '@/helpers/getUser';

// Mock constants
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock de la API
jest.mock('@/api/apiUsuarios', () => ({
  getUsuarios: jest.fn()
}));

import { getUsuarios } from '@/api/apiUsuarios';
const mockGetUsuarios = getUsuarios as jest.MockedFunction<typeof getUsuarios>;

describe('LoadUsuarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getUsuarios and return response', async () => {
    const mockResponse = {
      data: {
        results: [
          { id: 1, nombre: 'Usuario 1', email: 'user1@test.com' },
          { id: 2, nombre: 'Usuario 2', email: 'user2@test.com' }
        ]
      }
    };

    mockGetUsuarios.mockResolvedValue(mockResponse as any);

    const result = await LoadUsuarios();

    expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors from API', async () => {
    const error = new Error('Failed to load usuarios');
    mockGetUsuarios.mockRejectedValue(error);

    await expect(LoadUsuarios()).rejects.toThrow('Failed to load usuarios');
    expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
  });

  it('should return empty results when API returns empty', async () => {
    const mockResponse = {
      data: { results: [] }
    };

    mockGetUsuarios.mockResolvedValue(mockResponse as any);

    const result = await LoadUsuarios();

    expect(result.data.results).toEqual([]);
    expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
  });

  it('should handle API response with different structure', async () => {
    const mockResponse = {
      data: {
        results: [
          { id: 99, nombre: 'Admin User', email: 'admin@test.com', role: 'admin' }
        ],
        totalCount: 1,
        page: 1
      }
    };

    mockGetUsuarios.mockResolvedValue(mockResponse as any);

    const result = await LoadUsuarios();

    expect(result.data.results).toHaveLength(1);
    expect(result.data.results[0].role).toBe('admin');
    expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
  });
});
