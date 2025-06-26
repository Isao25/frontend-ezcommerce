import { LoadEtiquetas } from '@/helpers/LoadEtiquetas';

// Mock constants
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock the API
jest.mock('@/api/apiEtiquetas', () => ({
  getEtiquetas: jest.fn()
}));

import { getEtiquetas } from '@/api/apiEtiquetas';
const mockedGetEtiquetas = getEtiquetas as jest.MockedFunction<typeof getEtiquetas>;

describe('LoadEtiquetas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getEtiquetas and return response', async () => {
    const mockResponse = {
      data: {
        results: [
          { id: 1, nombre: 'Etiqueta 1', descripcion: 'Desc 1' },
          { id: 2, nombre: 'Etiqueta 2', descripcion: 'Desc 2' }
        ]
      }
    };

    mockedGetEtiquetas.mockResolvedValue(mockResponse as any);

    const result = await LoadEtiquetas();

    expect(mockedGetEtiquetas).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors from API', async () => {
    const error = new Error('Failed to load etiquetas');
    mockedGetEtiquetas.mockRejectedValue(error);

    await expect(LoadEtiquetas()).rejects.toThrow('Failed to load etiquetas');
    expect(mockedGetEtiquetas).toHaveBeenCalledTimes(1);
  });

  it('should return empty results when API returns empty', async () => {
    const mockResponse = {
      data: { results: [] }
    };

    mockedGetEtiquetas.mockResolvedValue(mockResponse as any);

    const result = await LoadEtiquetas();

    expect(result.data.results).toEqual([]);
    expect(mockedGetEtiquetas).toHaveBeenCalledTimes(1);
  });
});
