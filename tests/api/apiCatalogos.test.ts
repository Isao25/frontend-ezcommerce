jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

import axios from 'axios';
import { getCatalogoUser, getCatalogoById } from '@/api/apiCatalogos';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn()
  }))
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Catalogos API', () => {
  const mockAxiosInstance = { get: jest.fn() };
  const mockCatalogo = {
    id: 1,
    id_usuario: 1,
    nombre: 'Test Catalog'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  describe('getCatalogoUser', () => {
    it('should fetch catalog by user id', async () => {
      const mockResponse = { data: { results: [mockCatalogo] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getCatalogoUser(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/?id_usuario=1');
      expect(result.data.results).toEqual([mockCatalogo]);
    });

    it('should handle API errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('API Error'));
      await expect(getCatalogoUser(1)).rejects.toThrow('API Error');
    });
  });

  describe('getCatalogoById', () => {
    it('should fetch catalog by id', async () => {
      const mockResponse = { data: mockCatalogo };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getCatalogoById(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/1');
      expect(result.data).toEqual(mockCatalogo);
    });
  });
});
