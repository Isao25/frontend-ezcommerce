import { LoadCatalogos } from '../../src/helpers/LoadCatalogos';
import { getCatalogoUser } from '../../src/api/apiCatalogos';

// Mock the API
jest.mock('../../api/apiCatalogos');
const mockedGetCatalogoUser = getCatalogoUser as jest.MockedFunction<typeof getCatalogoUser>;

describe('LoadCatalogos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns catalog data for a user', async () => {
    const mockCatalogos = [
      {
        id: 1,
        id_usuario: 123,
        id_marca: null,
        capacidad_maxima: 10,
        espacio_ocupado: 5
      },
      {
        id: 2,
        id_usuario: 123,
        id_marca: 1,
        capacidad_maxima: 20,
        espacio_ocupado: 15
      }
    ];

    mockedGetCatalogoUser.mockResolvedValue({
      data: { results: mockCatalogos }
    } as any);

    const result = await LoadCatalogos(123);

    expect(mockedGetCatalogoUser).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockCatalogos);
  });

  it('handles API errors', async () => {
    const mockError = new Error('Failed to fetch catalogs');
    mockedGetCatalogoUser.mockRejectedValue(mockError);

    await expect(LoadCatalogos(123)).rejects.toThrow('Failed to fetch catalogs');
    expect(mockedGetCatalogoUser).toHaveBeenCalledWith(123);
  });

  it('returns empty array when no catalogs found', async () => {
    mockedGetCatalogoUser.mockResolvedValue({
      data: { results: [] }
    } as any);

    const result = await LoadCatalogos(123);

    expect(result).toEqual([]);
    expect(mockedGetCatalogoUser).toHaveBeenCalledWith(123);
  });

  it('handles different user IDs correctly', async () => {
    const mockCatalogos = [
      {
        id: 3,
        id_usuario: 456,
        id_marca: 2,
        capacidad_maxima: 15,
        espacio_ocupado: 8
      }
    ];

    mockedGetCatalogoUser.mockResolvedValue({
      data: { results: mockCatalogos }
    } as any);

    const result = await LoadCatalogos(456);

    expect(mockedGetCatalogoUser).toHaveBeenCalledWith(456);
    expect(result).toEqual(mockCatalogos);
  });

  it('handles catalogs with marca vs without marca', async () => {
    const mockCatalogos = [
      {
        id: 1,
        id_usuario: 123,
        id_marca: null, // User catalog
        capacidad_maxima: 10,
        espacio_ocupado: 3
      },
      {
        id: 2,
        id_usuario: 123,
        id_marca: 5, // Brand catalog
        capacidad_maxima: 50,
        espacio_ocupado: 25
      }
    ];

    mockedGetCatalogoUser.mockResolvedValue({
      data: { results: mockCatalogos }
    } as any);

    const result = await LoadCatalogos(123);

    expect(result).toEqual(mockCatalogos);
    expect(result).toHaveLength(2);
    expect(result[0].id_marca).toBeNull();
    expect(result[1].id_marca).toBe(5);
  });
});
