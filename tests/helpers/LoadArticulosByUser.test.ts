import { LoadArticulosByUser } from '../../src/helpers/LoadArticulosByUser';
import { getArticulosByUsuario } from '../../src/api/apiArticulos';

// Mock the API
jest.mock('../../api/apiArticulos');
const mockedGetArticulosByUsuario = getArticulosByUsuario as jest.MockedFunction<typeof getArticulosByUsuario>;

describe('LoadArticulosByUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns articles data for a user', async () => {
    const mockArticulos = [
      {
        id: 1,
        nombre: 'Article 1',
        descripcion: 'Description 1',
        precio: 100,
        stock: 5,
        etiquetas: [1, 2],
        is_marca: false,
        id_catalogo: 1
      },
      {
        id: 2,
        nombre: 'Article 2',
        descripcion: 'Description 2',
        precio: 200,
        stock: 10,
        etiquetas: [2, 3],
        is_marca: true,
        id_catalogo: 1
      }
    ];

    mockedGetArticulosByUsuario.mockResolvedValue({
      data: { results: mockArticulos }
    } as any);

    const result = await LoadArticulosByUser(123);

    expect(mockedGetArticulosByUsuario).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockArticulos);
  });

  it('handles API errors', async () => {
    const mockError = new Error('Failed to fetch articles');
    mockedGetArticulosByUsuario.mockRejectedValue(mockError);

    await expect(LoadArticulosByUser(123)).rejects.toThrow('Failed to fetch articles');
    expect(mockedGetArticulosByUsuario).toHaveBeenCalledWith(123);
  });

  it('returns empty array when no articles found', async () => {
    mockedGetArticulosByUsuario.mockResolvedValue({
      data: { results: [] }
    } as any);

    const result = await LoadArticulosByUser(123);

    expect(result).toEqual([]);
    expect(mockedGetArticulosByUsuario).toHaveBeenCalledWith(123);
  });

  it('handles different user IDs correctly', async () => {
    const mockArticulos = [
      {
        id: 5,
        nombre: 'User 456 Article',
        descripcion: 'Description for user 456',
        precio: 50,
        stock: 3,
        etiquetas: [4],
        is_marca: false,
        id_catalogo: 2
      }
    ];

    mockedGetArticulosByUsuario.mockResolvedValue({
      data: { results: mockArticulos }
    } as any);

    const result = await LoadArticulosByUser(456);

    expect(mockedGetArticulosByUsuario).toHaveBeenCalledWith(456);
    expect(result).toEqual(mockArticulos);
  });
});