
import { getProductCart } from '@/helpers/getProducCart';
import * as apiArticulos from '@/api/apiArticulos';
import * as apiCatalogos from '@/api/apiCatalogos';
import * as apiUsuarios from '@/api/apiUsuarios';
import * as imageHelper from '@/helpers/getImageMajor';

jest.mock('@/api/apiArticulos');
jest.mock('@/api/apiCatalogos');
jest.mock('@/api/apiUsuarios');
jest.mock('@/helpers/getImageMajor');

describe('getProductCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns complete product cart data', async () => {
    const mockProduct = {
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      descripcion: 'Test Description',
      id_catalogo: 1
    };

    const mockCatalogo = {
      data: { id_usuario: 1 }
    };

    const mockUser = {
      data: { nombres: 'John Doe' }
    };

    const mockImages = [{ url: 'test-image.jpg' }];

    (apiArticulos.getArticulo as jest.Mock).mockResolvedValue({ data: mockProduct });
    (apiCatalogos.getCatalogoById as jest.Mock).mockResolvedValue(mockCatalogo);
    (apiUsuarios.getUsuarios as jest.Mock).mockResolvedValue(mockUser);
    (imageHelper.LoadImageMajor as jest.Mock).mockResolvedValue(mockImages);

    const result = await getProductCart(1);

    expect(result).toEqual({
      ownerProduct: 'John Doe',
      productTitle: 'Test Product',
      productPrice: 100,
      productDescription: 'Test Description',
      productUrl: 'test-image.jpg',
      productRating: 4,
      quantity: 1
    });
  });

  test('handles missing product', async () => {
    (apiArticulos.getArticulo as jest.Mock).mockResolvedValue({ data: null });

    await expect(getProductCart(999)).rejects.toThrow('No se encontró el producto con ID 999');
  });
});
