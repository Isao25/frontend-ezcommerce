import { getProductCart } from '@/helpers/getProducCart';

// Mock constants
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock APIs
jest.mock('@/api/apiCatalogos', () => ({
  getCatalogo: jest.fn()
}));

jest.mock('@/api/apiArticulos', () => ({
  getArticulo: jest.fn()
}));

jest.mock('@/api/apiMarcas', () => ({
  marcasService: {
    getMarca: jest.fn()
  }
}));

jest.mock('@/helpers/getImageMajor', () => ({
  getImageMajor: jest.fn()
}));

import { getCatalogo } from '@/api/apiCatalogos';
import { getArticulo } from '@/api/apiArticulos';
import { marcasService } from '@/api/apiMarcas';
import { getImageMajor } from '@/helpers/getImageMajor';

const mockedGetCatalogo = getCatalogo as jest.MockedFunction<typeof getCatalogo>;
const mockedGetArticulo = getArticulo as jest.MockedFunction<typeof getArticulo>;
const mockedGetMarca = marcasService.getMarca as jest.MockedFunction<typeof marcasService.getMarca>;
const mockedGetImageMajor = getImageMajor as jest.MockedFunction<typeof getImageMajor>;

describe('getProductCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return product cart data successfully', async () => {
    const mockCatalogo = {
      data: {
        id: 1,
        id_articulo: 1,
        precio: 100,
        descripcion: 'Test catalog description',
        id_marca: 1
      }
    };

    const mockArticulo = {
      data: {
        id: 1,
        nombre: 'Test Product',
        descripcion: 'Test product description',
        puntuacion: 4.5
      }
    };

    const mockMarca = {
      data: {
        id: 1,
        nombre: 'Test Brand'
      }
    };

    const mockImageUrl = 'https://test.com/image.jpg';

    mockedGetCatalogo.mockResolvedValue(mockCatalogo as any);
    mockedGetArticulo.mockResolvedValue(mockArticulo as any);
    mockedGetMarca.mockResolvedValue(mockMarca as any);
    mockedGetImageMajor.mockResolvedValue(mockImageUrl);

    const result = await getProductCart(1);

    expect(result).toEqual({
      productTitle: 'Test Product',
      productPrice: 100,
      productDescription: 'Test catalog description',
      productUrl: mockImageUrl,
      productRating: 4.5,
      quantity: 1,
      ownerProduct: 'Test Brand'
    });

    expect(mockedGetCatalogo).toHaveBeenCalledWith(1);
    expect(mockedGetArticulo).toHaveBeenCalledWith(1);
    expect(mockedGetMarca).toHaveBeenCalledWith(1);
    expect(mockedGetImageMajor).toHaveBeenCalledWith(1);
  });

  it('should handle errors when fetching catalog', async () => {
    mockedGetCatalogo.mockRejectedValue(new Error('Catalog not found'));

    await expect(getProductCart(1)).rejects.toThrow('Catalog not found');
    expect(mockedGetCatalogo).toHaveBeenCalledWith(1);
  });

  it('should handle errors when fetching article', async () => {
    const mockCatalogo = {
      data: {
        id: 1,
        id_articulo: 1,
        precio: 100,
        descripcion: 'Test description',
        id_marca: 1
      }
    };

    mockedGetCatalogo.mockResolvedValue(mockCatalogo as any);
    mockedGetArticulo.mockRejectedValue(new Error('Article not found'));

    await expect(getProductCart(1)).rejects.toThrow('Article not found');
  });

  it('should handle errors when fetching marca', async () => {
    const mockCatalogo = {
      data: {
        id: 1,
        id_articulo: 1,
        precio: 100,
        descripcion: 'Test description',
        id_marca: 1
      }
    };

    const mockArticulo = {
      data: {
        id: 1,
        nombre: 'Test Product',
        descripcion: 'Test product description',
        puntuacion: 4.5
      }
    };

    mockedGetCatalogo.mockResolvedValue(mockCatalogo as any);
    mockedGetArticulo.mockResolvedValue(mockArticulo as any);
    mockedGetMarca.mockRejectedValue(new Error('Marca not found'));

    await expect(getProductCart(1)).rejects.toThrow('Marca not found');
  });

  it('should handle errors when fetching image', async () => {
    const mockCatalogo = {
      data: {
        id: 1,
        id_articulo: 1,
        precio: 100,
        descripcion: 'Test description',
        id_marca: 1
      }
    };

    const mockArticulo = {
      data: {
        id: 1,
        nombre: 'Test Product',
        descripcion: 'Test product description',
        puntuacion: 4.5
      }
    };

    const mockMarca = {
      data: {
        id: 1,
        nombre: 'Test Brand'
      }
    };

    mockedGetCatalogo.mockResolvedValue(mockCatalogo as any);
    mockedGetArticulo.mockResolvedValue(mockArticulo as any);
    mockedGetMarca.mockResolvedValue(mockMarca as any);
    mockedGetImageMajor.mockRejectedValue(new Error('Image not found'));

    await expect(getProductCart(1)).rejects.toThrow('Image not found');
  });

  it('should work with different product IDs', async () => {
    const mockCatalogo = {
      data: {
        id: 999,
        id_articulo: 999,
        precio: 250,
        descripcion: 'Premium product',
        id_marca: 999
      }
    };

    const mockArticulo = {
      data: {
        id: 999,
        nombre: 'Premium Product',
        descripcion: 'Premium description',
        puntuacion: 5
      }
    };

    const mockMarca = {
      data: {
        id: 999,
        nombre: 'Premium Brand'
      }
    };

    const mockImageUrl = 'https://premium.com/image.jpg';

    mockedGetCatalogo.mockResolvedValue(mockCatalogo as any);
    mockedGetArticulo.mockResolvedValue(mockArticulo as any);
    mockedGetMarca.mockResolvedValue(mockMarca as any);
    mockedGetImageMajor.mockResolvedValue(mockImageUrl);

    const result = await getProductCart(999);

    expect(result.productTitle).toBe('Premium Product');
    expect(result.productPrice).toBe(250);
    expect(result.ownerProduct).toBe('Premium Brand');
    expect(mockedGetCatalogo).toHaveBeenCalledWith(999);
  });
});