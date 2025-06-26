jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

import axios from 'axios';
import { getAllFacultades, Facultad } from '@/api/apiFacultades';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn()
  }))
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Facultades API', () => {
  const mockAxiosInstance = { get: jest.fn() };
  const mockFacultad: Facultad = {
    codigo: 1,
    nombre: 'Facultad de Ingeniería',
    siglas: 'FI'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  describe('getAllFacultades', () => {
    it('should fetch facultades with pagination', async () => {
      const mockResponse = { data: { results: [mockFacultad] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getAllFacultades(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/?page=1');
      expect(result.data.results).toEqual([mockFacultad]);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('API Error'));
      await expect(getAllFacultades(1)).rejects.toThrow('API Error');
    });
  });
});
