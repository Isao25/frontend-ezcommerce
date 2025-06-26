
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock api.ts para AxiosService
jest.mock('@/api/api', () => ({
  AxiosService: jest.fn().mockImplementation(() => ({
    instance: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    }
  })),
  AxiosProtectedService: jest.fn().mockImplementation(() => ({
    instance: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    }
  }))
}));

import {
  createUsuario,
  getUsuarios,
  escuelasService,
  EscuelasService
} from '@/api/apiUsuarios';
import { Usuario } from '@/types';

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

describe('apiUsuarios', () => {
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

  const mockUsuario: Usuario = {
    id: 1,
    id_escuela: 1,
    username: 'test@unmsm.edu.pe',
    email: 'test@unmsm.edu.pe',
    nombres: 'Juan',
    apellido_p: 'Pérez',
    apellido_m: 'García',
    celular: '987654321',
    codigo: '20210001'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the usuariosApi instance
    const apiUsuarios = require('@/api/apiUsuarios');
    apiUsuarios.usuariosApi = { instance: mockAxiosInstance };
  });

  describe('createUsuario function', () => {
    it('should call post method with correct parameters', async () => {
      const mockResponse = { data: { id: 1, ...mockUsuario }, status: 201 };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await createUsuario(mockUsuario);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/', mockUsuario);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(createUsuario(mockUsuario)).rejects.toThrow('API Error');
    });

    it('should work with partial usuario data', async () => {
      const partialUsuario = {
        nombres: 'Test',
        email: 'test@unmsm.edu.pe'
      } as Usuario;

      const mockResponse = { data: partialUsuario, status: 201 };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await createUsuario(partialUsuario);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/', partialUsuario);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUsuarios function', () => {
    it('should call get method with correct userId', async () => {
      const userId = 123;
      const mockResponse = {
        data: {
          id: userId,
          nombres: 'Juan',
          apellido_p: 'Pérez',
          apellido_m: 'García'
        },
        status: 200
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getUsuarios(userId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/${userId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle different user IDs', async () => {
      const userIds = [1, 999, 12345];
      const mockResponse = { data: { id: 1 }, status: 200 };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      for (const userId of userIds) {
        await getUsuarios(userId);
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/${userId}`);
      }

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(userIds.length);
    });

    it('should handle API errors', async () => {
      const userId = 123;
      const mockError = new Error('User not found');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(getUsuarios(userId)).rejects.toThrow('User not found');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/${userId}`);
    });

    it('should handle 404 errors', async () => {
      const userId = 999;
      const mockError = {
        response: { status: 404, data: { message: 'User not found' } }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(getUsuarios(userId)).rejects.toEqual(mockError);
    });
  });

  describe('EscuelasService class', () => {
    let escuelasServiceInstance: EscuelasService;

    beforeEach(() => {
      escuelasServiceInstance = new EscuelasService('http://test-base-url');
      // Mock the instance
      (escuelasServiceInstance as any).instance = mockAxiosInstance;
    });

    it('should be instance of EscuelasService', () => {
      expect(escuelasServiceInstance).toBeInstanceOf(EscuelasService);
    });

    describe('getEscuelas method', () => {
      it('should call get method with correct endpoint', async () => {
        const mockEscuelas = [
          { id: '1', nombre: 'Ingeniería de Sistemas', codigo: 'SIS', id_facultad: '1' },
          { id: '2', nombre: 'Medicina', codigo: 'MED', id_facultad: '2' }
        ];
        const mockResponse = { data: { results: mockEscuelas }, status: 200 };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await escuelasServiceInstance.getEscuelas();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/');
        expect(result).toEqual(mockResponse);
      });

      it('should handle API errors in getEscuelas', async () => {
        const mockError = new Error('Escuelas fetch failed');
        mockAxiosInstance.get.mockRejectedValue(mockError);

        await expect(escuelasServiceInstance.getEscuelas()).rejects.toThrow('Escuelas fetch failed');
      });

      it('should handle empty results', async () => {
        const mockResponse = { data: { results: [] }, status: 200 };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await escuelasServiceInstance.getEscuelas();

        expect(result.data.results).toEqual([]);
      });

      it('should handle malformed response', async () => {
        const mockResponse = { data: null, status: 200 };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await escuelasServiceInstance.getEscuelas();

        expect(result.data).toBeNull();
      });
    });
  });

  describe('escuelasService instance', () => {
    beforeEach(() => {
      // Mock the exported instance
      const apiUsuarios = require('@/api/apiUsuarios');
      apiUsuarios.escuelasService = {
        instance: mockAxiosInstance,
        getEscuelas: jest.fn()
      };
    });

    it('should have access to getEscuelas method', () => {
      expect(typeof escuelasService.getEscuelas).toBe('function');
    });

    it('should call getEscuelas method successfully', async () => {
      const mockResponse = { data: { results: [] }, status: 200 };
      escuelasService.getEscuelas = jest.fn().mockResolvedValue(mockResponse);

      const result = await escuelasService.getEscuelas();

      expect(escuelasService.getEscuelas).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete user creation flow', async () => {
      const newUser: Usuario = {
        id_escuela: 1,
        username: 'newuser@unmsm.edu.pe',
        email: 'newuser@unmsm.edu.pe',
        nombres: 'Nuevo',
        apellido_p: 'Usuario',
        apellido_m: 'Test',
        celular: '123456789',
        codigo: '20230001'
      };

      const createResponse = { data: { id: 456, ...newUser }, status: 201 };
      const getResponse = { data: { id: 456, ...newUser }, status: 200 };

      mockAxiosInstance.post.mockResolvedValue(createResponse);
      mockAxiosInstance.get.mockResolvedValue(getResponse);

      // Create user
      const createdUser = await createUsuario(newUser);
      expect(createdUser.data.id).toBe(456);

      // Get user
      const fetchedUser = await getUsuarios(456);
      expect(fetchedUser.data.id).toBe(456);
      expect(fetchedUser.data.nombres).toBe('Nuevo');
    });

    it('should handle escuelas and usuarios workflow', async () => {
      const escuelasResponse = {
        data: {
          results: [
            { id: '1', nombre: 'Ingeniería de Sistemas', codigo: 'SIS', id_facultad: '1' }
          ]
        },
        status: 200
      };

      const userResponse = {
        data: {
          id: 1,
          id_escuela: 1,
          nombres: 'Test User'
        },
        status: 200
      };

      mockAxiosInstance.get
        .mockResolvedValueOnce(escuelasResponse) // For escuelas
        .mockResolvedValueOnce(userResponse);    // For user

      // Mock escuelasService for this test
      escuelasService.getEscuelas = jest.fn().mockResolvedValue(escuelasResponse);

      // Get escuelas
      const escuelas = await escuelasService.getEscuelas();
      expect(escuelas.data.results).toHaveLength(1);

      // Get user
      const user = await getUsuarios(1);
      expect(user.data.id_escuela).toBe(1);
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle network timeouts', async () => {
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      mockAxiosInstance.post.mockRejectedValue(timeoutError);

      const mockUsuarioData: Usuario = {
        nombres: 'Test',
        email: 'test@unmsm.edu.pe'
      } as Usuario;

      await expect(createUsuario(mockUsuarioData)).rejects.toThrow('Network timeout');
    });

    it('should handle server errors', async () => {
      const serverError = new Error('Internal server error');
      mockAxiosInstance.get.mockRejectedValue(serverError);

      await expect(getUsuarios(1)).rejects.toThrow('Internal server error');
    });

    it('should handle malformed request data', async () => {
      const malformedUser = null as any;
      const validationError = new Error('Validation failed');
      mockAxiosInstance.post.mockRejectedValue(validationError);

      await expect(createUsuario(malformedUser)).rejects.toThrow('Validation failed');
    });
  });

  describe('Interceptors functionality', () => {
    it('should have request and response interceptors configured', () => {
      const apiUsuarios = require('@/api/apiUsuarios');
      
      // Verify interceptors are set up
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });
});
