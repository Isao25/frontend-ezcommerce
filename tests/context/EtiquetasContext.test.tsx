import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EtiquetasProvider, EtiquetasContext } from '../../src/context/EtiquetasContext';
import * as apiEtiquetas from '../../src/api/apiEtiquetas';

// Mock the API
jest.mock('../../src/api/apiEtiquetas');
const mockedApiEtiquetas = apiEtiquetas as jest.Mocked<typeof apiEtiquetas>;

// Test component to consume context
const TestComponent = () => {
  const context = React.useContext(EtiquetasContext);
  
  return (
    <div>
      <div data-testid="loading-etiquetas">{context.loadingEtiquetas.toString()}</div>
      <div data-testid="loading-page">{context.loadingPage.toString()}</div>
      <div data-testid="etiquetas-count">{context.etiquetasList.length}</div>
    </div>
  );
};

describe('EtiquetasContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state correctly', () => {
    mockedApiEtiquetas.getEtiquetas.mockResolvedValue({
      data: { results: [] }
    } as any);

    render(
      <EtiquetasProvider>
        <TestComponent />
      </EtiquetasProvider>
    );

    expect(screen.getByTestId('loading-etiquetas')).toHaveTextContent('true');
    expect(screen.getByTestId('loading-page')).toHaveTextContent('true');
    expect(screen.getByTestId('etiquetas-count')).toHaveTextContent('0');
  });

  it('loads etiquetas successfully', async () => {
    const mockEtiquetas = [
      { id: 1, nombre: 'Etiqueta 1', descripcion: 'Desc 1' },
      { id: 2, nombre: 'Etiqueta 2', descripcion: 'Desc 2' },
    ];

    mockedApiEtiquetas.getEtiquetas.mockResolvedValue({
      data: { results: mockEtiquetas }
    } as any);

    render(
      <EtiquetasProvider>
        <TestComponent />
      </EtiquetasProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-etiquetas')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('etiquetas-count')).toHaveTextContent('2');
  });

  it('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockedApiEtiquetas.getEtiquetas.mockRejectedValue(new Error('API Error'));

    render(
      <EtiquetasProvider>
        <TestComponent />
      </EtiquetasProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-etiquetas')).toHaveTextContent('false');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch etiquetas', expect.any(Error));
    expect(screen.getByTestId('etiquetas-count')).toHaveTextContent('0');
    
    consoleSpy.mockRestore();
  });
});
