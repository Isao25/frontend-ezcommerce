// src/helpers/__tests__/getUser.test.ts
import { LoadUsuarios } from '../../src/helpers/getUser';
import { getUsuarios } from '../../src/api/apiUsuarios';
import { Usuario } from '../../src/types';

LoadUsuarios
// Mock de la API
jest.mock('../../api/apiUsuarios');
const mockGetUsuarios = getUsuarios as jest.MockedFunction<typeof getUsuarios>;

describe('LoadUsuarios', () => {
  const mockUserId = 123;
  const mockUserData: Usuario = {
    id: 123,
    id_escuela: 1,
    username: 'test@unmsm.edu.pe',
    email: 'test@unmsm.edu.pe',
    nombres: 'Juan',
    apellido_p: 'Pérez',
    apellido_m: 'García',
    celular: '987654321',
    codigo: '20210001',
    fecha_nacimiento: '1990-01-01',
    codigo_qr: 'qr-code-url'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data when API call is successful', async () => {
    // Arrange
    const mockApiResponse = {
      data: mockUserData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    mockGetUsuarios.mockResolvedValue(mockApiResponse as any);

    // Act
    const result = await LoadUsuarios(mockUserId);

    // Assert
    expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
    expect(mockGetUsuarios).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual(mockUserData);
  });

  it('should handle API response with different data structure', async () => {
    // Arrange
    const differentUserData = {
      id: 456,
      id_escuela: 2,
      username: 'maria@unmsm.edu.pe',
      email: 'maria@unmsm.edu.pe',
      nombres: 'María',
      apellido_p: 'López',
      apellido_m: 'Martínez',
      celular: '123456789',
      codigo: '20210002'
    };

    const mockApiResponse = {
      data: differentUserData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    mockGetUsuarios.mockResolvedValue(mockApiResponse as any);

    // Act
    const result = await LoadUsuarios(456);

    // Assert
    expect(result).toEqual(differentUserData);
  });

  it('should throw error when API call fails', async () => {
    // Arrange
    const mockError = new Error('Network error');
    mockGetUsuarios.mockRejectedValue(mockError);

    // Act & Assert
    await expect(LoadUsuarios(mockUserId)).rejects.toThrow('Network error');
    expect(mockGetUsuarios).toHaveBeenCalledTimes(1);
    expect(mockGetUsuarios).toHaveBeenCalledWith(mockUserId);
  });

  it('should handle API call with status 404', async () => {
    // Arrange
    const mockError = {
      response: {
        status: 404,
        data: { message: 'User not found' }
      }
    };
    mockGetUsuarios.mockRejectedValue(mockError);

    // Act & Assert
    await expect(LoadUsuarios(mockUserId)).rejects.toEqual(mockError);
  });

  it('should handle API call with status 500', async () => {
    // Arrange
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Internal server error' }
      }
    };
    mockGetUsuarios.mockRejectedValue(mockError);

    // Act & Assert
    await expect(LoadUsuarios(mockUserId)).rejects.toEqual(mockError);
  });

  it('should work with different user IDs', async () => {
    // Arrange
    const userIds = [1, 999, 12345];
    const responses = userIds.map(id => ({
      data: { ...mockUserData, id },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    }));

    userIds.forEach((userId, index) => {
      mockGetUsuarios.mockResolvedValueOnce(responses[index] as any);
    });

    // Act & Assert
    for (let i = 0; i < userIds.length; i++) {
      const result = await LoadUsuarios(userIds[i]);
      expect(result.id).toBe(userIds[i]);
    }

    expect(mockGetUsuarios).toHaveBeenCalledTimes(userIds.length);
  });

  it('should handle null or undefined response data', async () => {
    // Arrange
    const mockApiResponse = {
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    mockGetUsuarios.mockResolvedValue(mockApiResponse as any);

    // Act
    const result = await LoadUsuarios(mockUserId);

    // Assert
    expect(result).toBeNull();
  });

  it('should preserve all user data properties', async () => {
    // Arrange
    const completeUserData: Usuario = {
      id: 789,
      id_escuela: 3,
      username: 'complete@unmsm.edu.pe',
      email: 'complete@unmsm.edu.pe',
      nombres: 'Carlos Eduardo',
      apellido_p: 'González',
      apellido_m: 'Rodríguez',
      celular: '987123456',
      codigo: '20210003',
      fecha_nacimiento: '1995-06-15',
      codigo_qr: 'complete-qr-code-url'
    };

    const mockApiResponse = {
      data: completeUserData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    mockGetUsuarios.mockResolvedValue(mockApiResponse as any);

    // Act
    const result = await LoadUsuarios(789);

    // Assert
    expect(result).toEqual(completeUserData);
    expect(Object.keys(result)).toEqual(Object.keys(completeUserData));
  });
});