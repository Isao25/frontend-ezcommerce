import { LoadEtiquetas } from '@/helpers/LoadEtiquetas';
import * as apiEtiquetas from '@/api/apiEtiquetas';

jest.mock('@/api/apiEtiquetas');

describe('LoadEtiquetas', () => {
  test('returns mapped etiquetas data', async () => {
    const mockData = {
      data: {
        results: [
          { id: 1, nombre: 'Etiqueta 1' },
          { id: 2, nombre: 'Etiqueta 2' }
        ]
      }
    };

    (apiEtiquetas.getEtiquetas as jest.Mock).mockResolvedValue(mockData);

    const result = await LoadEtiquetas();

    expect(result).toEqual([
      { id: 1, nombre: 'Etiqueta 1' },
      { id: 2, nombre: 'Etiqueta 2' }
    ]);
  });

  test('handles API errors', async () => {
    (apiEtiquetas.getEtiquetas as jest.Mock).mockRejectedValue(new Error('API Error'));

    await expect(LoadEtiquetas()).rejects.toThrow('API Error');
  });
});
