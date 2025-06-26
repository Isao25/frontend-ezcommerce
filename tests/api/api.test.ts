// tests/api/api.test.ts - CORREGIDO
// Mock constants ANTES de cualquier import
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

import axios from 'axios';
import { logout, refreshAccessToken } from '@/context/AuthContext';
import { Tokens } from '@/types';
import { AxiosService, AxiosProtectedService, baseURL } from '@/api/api';

// Mock dependencies
jest.mock('axios');
jest.mock('@/context/AuthContext');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockLogout = logout as jest.MockedFunction<typeof logout>;
const mockRefreshAccessToken = refreshAccessToken as jest.MockedFunction<typeof refreshAccessToken>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  describe('Configuration', () => {
    it('should have correct baseURL', () => {
      expect(baseURL).toBe('http://localhost:8000');
    });
  });

  describe('AxiosService', () => {
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    beforeEach(() => {
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    });

    it('should create axios instance with provided baseURL', () => {
      const service = new AxiosService('http://test.com');

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://test.com',
      });
      expect(service.instance).toBe(mockAxiosInstance);
    });

    it('should create instance with different baseURLs', () => {
      const baseUrl1 = 'http://api1.com';
      const baseUrl2 = 'http://api2.com';

      new AxiosService(baseUrl1);
      new AxiosService(baseUrl2);

      expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: baseUrl1 });
      expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: baseUrl2 });
    });
  });

  describe('AxiosProtectedService', () => {
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    };

    beforeEach(() => {
      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    });

    it('should create protected service and add interceptors', () => {
      const service = new AxiosProtectedService('http://test.com');

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://test.com',
      });
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });

    describe('Request Interceptor', () => {
      let requestInterceptor: (config: any) => any;

      beforeEach(() => {
        new AxiosProtectedService('http://test.com');
        requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      });

      it('should add Authorization header when tokens exist', () => {
        const mockTokens: Tokens = {
          access: 'test-access-token',
          refresh: 'test-refresh-token'
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTokens));

        const config = { headers: {} };
        const result = requestInterceptor(config);

        expect(result.headers.Authorization).toBe('Bearer test-access-token');
      });

      it('should not add Authorization header when no tokens', () => {
        localStorageMock.getItem.mockReturnValue('null');

        const config = { headers: {} };
        const result = requestInterceptor(config);

        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should not add Authorization header when access token is missing', () => {
        const mockTokens = { refresh: 'test-refresh-token' };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTokens));

        const config = { headers: {} };
        const result = requestInterceptor(config);

        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should handle localStorage parsing errors', () => {
        localStorageMock.getItem.mockReturnValue('invalid-json');

        const config = { headers: {} };
        
        expect(() => requestInterceptor(config)).not.toThrow();
      });
    });

    describe('Response Interceptor', () => {
      let responseInterceptor: (response: any) => any;
      let errorHandler: (error: any) => Promise<any>;

      beforeEach(() => {
        new AxiosProtectedService('http://test.com');
        const interceptorCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
        responseInterceptor = interceptorCall[0];
        errorHandler = interceptorCall[1];
      });

      it('should return response when successful', () => {
        const mockResponse = { data: { test: 'data' }, status: 200 };
        const result = responseInterceptor(mockResponse);

        expect(result).toBe(mockResponse);
      });

      it('should handle 401 errors with token refresh', async () => {
        const mockError = {
          response: { status: 401 },
          config: { headers: {} }
        };
        const newTokens: Tokens = {
          access: 'new-access-token',
          refresh: 'new-refresh-token'
        };

        mockRefreshAccessToken.mockResolvedValue(newTokens);
        mockAxiosInstance.mockReturnValue(Promise.resolve({ data: 'success' }));

        await errorHandler(mockError);

        expect(mockRefreshAccessToken).toHaveBeenCalled();
        expect(mockError.config.headers.Authorization).toBe('Bearer new-access-token');
        expect(mockAxiosInstance).toHaveBeenCalledWith(mockError.config);
      });

      it('should call logout when token refresh fails', async () => {
        const mockError = {
          response: { status: 401 },
          config: { headers: {} }
        };

        mockRefreshAccessToken.mockResolvedValue(null);

        await expect(errorHandler(mockError)).rejects.toThrow('Token refresh failed (no tokens returned)');
        expect(mockLogout).toHaveBeenCalled();
      });

      it('should call logout when token refresh throws error', async () => {
        const mockError = {
          response: { status: 401 },
          config: { headers: {} }
        };

        mockRefreshAccessToken.mockRejectedValue(new Error('Refresh failed'));

        await expect(errorHandler(mockError)).rejects.toThrow('Token refresh failed');
        expect(mockLogout).toHaveBeenCalled();
      });

      it('should not retry request twice', async () => {
        const mockError = {
          response: { status: 401 },
          config: { headers: {}, _retry: true }
        };

        await expect(errorHandler(mockError)).rejects.toThrow('Request failed');
        expect(mockRefreshAccessToken).not.toHaveBeenCalled();
      });

      it('should handle non-401 errors', async () => {
        const mockError = {
          response: { status: 500 },
          config: { headers: {} }
        };

        await expect(errorHandler(mockError)).rejects.toThrow('Request failed');
        expect(mockRefreshAccessToken).not.toHaveBeenCalled();
        expect(mockLogout).not.toHaveBeenCalled();
      });

      it('should handle errors without response', async () => {
        const mockError = {
          config: { headers: {} }
        };

        await expect(errorHandler(mockError)).rejects.toThrow('Request failed');
        expect(mockRefreshAccessToken).not.toHaveBeenCalled();
      });

      it('should set _retry flag on first attempt', async () => {
        const mockError = {
          response: { status: 401 },
          config: { headers: {} }
        };

        mockRefreshAccessToken.mockResolvedValue({
          access: 'new-token',
          refresh: 'new-refresh'
        });
        mockAxiosInstance.mockResolvedValue({ data: 'success' });

        await errorHandler(mockError);

        expect(mockError.config._retry).toBe(true);
      });

      it('should handle successful token refresh and retry', async () => {
        const mockError = {
          response: { status: 401 },
          config: { headers: {} }
        };
        const newTokens: Tokens = {
          access: 'new-access-token',
          refresh: 'refresh-token'
        };

        mockRefreshAccessToken.mockResolvedValue(newTokens);
        const retryResponse = { data: 'retry success' };
        mockAxiosInstance.mockResolvedValue(retryResponse);

        const result = await errorHandler(mockError);

        expect(result).toBe(retryResponse);
        expect(mockError.config.headers.Authorization).toBe('Bearer new-access-token');
      });
    });

    describe('Integration Tests', () => {
      it('should work with real-like scenario', async () => {
        const service = new AxiosProtectedService(baseURL);
        
        expect(service.instance).toBe(mockAxiosInstance);
        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
      });

      it('should handle multiple interceptor scenarios', () => {
        const service1 = new AxiosProtectedService('http://api1.com');
        const service2 = new AxiosProtectedService('http://api2.com');

        expect(mockedAxios.create).toHaveBeenCalledTimes(2);
        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(2);
        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(2);
      });
    });
  });
});
