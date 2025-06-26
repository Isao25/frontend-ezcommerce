import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EtiquetasProvider, EtiquetasContext } from '@/context/EtiquetasContext';

// Mock constants first
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock the API
jest.mock('@/api/apiEtiquetas', () => ({
  getEtiquetas: jest.fn()
}));

import { getEtiquetas } from '@/api/apiEtiquetas';
const mockedGetEtiquetas = getEtiquetas as jest.MockedFunction<typeof getEtiquetas>;

// Test component to consume context
const TestComponent = () => {
  const context = React.useContext(EtiquetasContext);
  
  return (
    <div>
      <div data-testid="loading-etiquetas">{context.loadingEtiquetas.toString()}</div>
      <div data-testid="loading-page">{context.loadingPage.toString()}</div>
      <div data-testid="etiquetas-count">{context.etiquetasList.length}</div>
      <div data-testid="etiquetas-list">
        {context.etiquetasList.map(etiqueta => etiqueta.nombre).join(',')}
      </div>
      <button 
        onClick={() => context.setLoadingPage(false)}
        data-testid="set-loading-page"
      >
        Set Loading Page False
      </button>
      <button 
        onClick={() => context.setEtiquetasList([{ id: 99, nombre: 'Manual', descripcion: 'Manual etiqueta' }])}
        data-testid="set-etiquetas"
      >
        Set Etiquetas Manually
      </button>
    </div>
  );
};

describe('EtiquetasContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state correctly', () => {
    mockedGetEtiquetas.mockResolvedValue({
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

    mockedGetEtiquetas.mockResolvedValue({
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
    expect(screen.getByTestId('etiquetas-list')).toHaveTextContent('Etiqueta 1,Etiqueta 2');
  });

  it('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockedGetEtiquetas.mockRejectedValue(new Error('API Error'));

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

  it('allows updating loading page state', async () => {
    mockedGetEtiquetas.mockResolvedValue({
      data: { results: [] }
    } as any);

    render(
      <EtiquetasProvider>
        <TestComponent />
      </EtiquetasProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading-etiquetas')).toHaveTextContent('false');
    });

    // Click button to change loading page state
    screen.getByTestId('set-loading-page').click();

    expect(screen.getByTestId('loading-page')).toHaveTextContent('false');
  });

  it('allows updating etiquetas list manually', async () => {
    mockedGetEtiquetas.mockResolvedValue({
      data: { results: [] }
    } as any);

    render(
      <EtiquetasProvider>
        <TestComponent />
      </EtiquetasProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading-etiquetas')).toHaveTextContent('false');
    });

    // Click button to set etiquetas manually
    screen.getByTestId('set-etiquetas').click();

    expect(screen.getByTestId('etiquetas-count')).toHaveTextContent('1');
    expect(screen.getByTestId('etiquetas-list')).toHaveTextContent('Manual');
  });

  it('calls getEtiquetas on mount', () => {
    mockedGetEtiquetas.mockResolvedValue({
      data: { results: [] }
    } as any);

    render(
      <EtiquetasProvider>
        <TestComponent />
      </EtiquetasProvider>
    );

    expect(mockedGetEtiquetas).toHaveBeenCalledTimes(1);
  });
});
