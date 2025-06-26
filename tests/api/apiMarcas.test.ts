jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

jest.mock('@/api/api', () => ({
  AxiosService: jest.fn().mockImplementation(() => ({
    instance: {
      get: jest.fn(),
      post: jest.fn(),
    }
  })),
  AxiosProtectedService: jest.fn().mockImplementation(() => ({
    instance: {
      get: jest.fn(),
      post: jest.fn(),
    }
  }))
}));

import { marcasService, membresiasService, planesService } from '@/api/apiMarcas';

describe('Marcas API Services', () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockMarca = {
    id: 1,
    id_usuario: 1,
    nombre: 'Test Brand'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock all service instances
    (marcasService as any).instance = mockInstance;
    (membresiasService as any).instance = mockInstance;
    (planesService as any).instance = mockInstance;
  });

  describe('MarcasService', () => {
    it('should get marca by usuario', async () => {
      const mockResponse = { data: { results: [mockMarca] } };
      mockInstance.get.mockResolvedValue(mockResponse);
      
      const result = await marcasService.getMarcaByUsuario(1);
      expect(result.data.results).toEqual([mockMarca]);
    });

    it('should create new marca', async () => {
      const mockResponse = { data: mockMarca };
      mockInstance.post.mockResolvedValue(mockResponse);
      
      const result = await marcasService.createMarca(mockMarca);
      expect(result.data).toEqual(mockMarca);
    });
  });

  describe('MembresiasService', () => {
    it('should get membresia by marca', async () => {
      const mockMembresia = { id: 1, id_marca: 1 };
      const mockResponse = { data: { results: [mockMembresia] } };
      mockInstance.get.mockResolvedValue(mockResponse);
      
      const result = await membresiasService.getMembresiaByMarca(1);
      expect(result.data.results).toEqual([mockMembresia]);
    });
  });

  describe('PlanesService', () => {
    it('should get plan by id', async () => {
      const mockPlan = { id: 1, nombre: 'Plan Básico' };
      const mockResponse = { data: mockPlan };
      mockInstance.get.mockResolvedValue(mockResponse);
      
      const result = await planesService.getPlan(1);
      expect(result.data).toEqual(mockPlan);
    });

    it('should get all planes', async () => {
      const mockPlan = { id: 1, nombre: 'Plan Básico' };
      const mockResponse = { data: { results: [mockPlan] } };
      mockInstance.get.mockResolvedValue(mockResponse);
      
      const result = await planesService.getPlanes();
      expect(result.data.results).toEqual([mockPlan]);
    });
  });
});
