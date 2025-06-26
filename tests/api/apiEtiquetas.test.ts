jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

import axios from 'axios';
import { getEtiquetas, Etiqueta } from '@/api/apiEtiquetas';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn()
  }))
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Etiquetas API', () => {
  const mockAxiosInstance = { get: jest.fn() };
  const mockEtiqueta: Etiqueta = {
    id: 1,
    nombre: 'Test Tag',
    descripcion: 'Test Description'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  describe('getEtiquetas', () => {
    it('should fetch all etiquetas', async () => {
      const mockResponse = { data: { results: [mockEtiqueta] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getEtiquetas();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/');
      expect(result.data.results).toEqual([mockEtiqueta]);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('API Error'));
      await expect(getEtiquetas()).rejects.toThrow('API Error');
    });
  });
});
