import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { TrademarkProvider, TrademarkContext } from '@/context/TrademarkContext';
import { useAuth } from '@/hooks/useAuth';

// Mock constants
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock dependencies
jest.mock('@/api/apiMarcas', () => ({
  marcasService: {
    getMarcaByUsuario: jest.fn(),
  },
  membresiasService: {
    getMembresiaByMarca: jest.fn(),
  },
  planesService: {
    getPlan: jest.fn(),
  },
}));

jest.mock('@/hooks/useAuth');

import { marcasService, membresiasService, planesService } from '@/api/apiMarcas';
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedMarcasService = marcasService as jest.Mocked<typeof marcasService>;
const mockedMembresiasService = membresiasService as jest.Mocked<typeof membresiasService>;
const mockedPlanesService = planesService as jest.Mocked<typeof planesService>;

// Test component to consume context
const TestComponent = () => {
  const context = React.useContext(TrademarkContext);
  
  if (!context) return <div data-testid="no-context">No context</div>;
  
  return (
    <div>
      <div data-testid="marca-name">{context.marca?.nombre || 'No marca'}</div>
      <div data-testid="marca-id">{context.marca?.id || 'No marca id'}</div>
      <div data-testid="plan-name">{context.plan?.nombre || 'No plan'}</div>
      <div data-testid="plan-id">{context.plan?.id || 'No plan id'}</div>
      <div data-testid="membresia-id">{context.membresia?.id || 'No membresia'}</div>
      <div data-testid="gratis-modal">{context.gratisModal.toString()}</div>
      <button 
        onClick={() => context.setGratisModal(true)}
        data-testid="set-gratis-modal"
      >
        Set Gratis Modal
      </button>
      <button 
        onClick={() => context.setMarca({ id: 99, nombre: 'Manual Marca', descripcion: 'Test', logo: 'test.jpg', id_usuario: 1 })}
        data-testid="set-marca"
      >
        Set Marca Manually
      </button>
    </div>
  );
};

describe('TrademarkContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial state when no user is authenticated', () => {
    mockedUseAuth.mockReturnValue({
      authState: { userId: null, accessToken: null },
    } as any);

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    expect(screen.getByTestId('marca-name')).toHaveTextContent('No marca');
    expect(screen.getByTestId('plan-name')).toHaveTextContent('No plan');
    expect(screen.getByTestId('membresia-id')).toHaveTextContent('No membresia');
    expect(screen.getByTestId('gratis-modal')).toHaveTextContent('false');
  });

  it('resets state when user logs out', async () => {
    // Start with authenticated user
    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    const { rerender } = render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    // Simulate logout
    mockedUseAuth.mockReturnValue({
      authState: { userId: null, accessToken: null },
    } as any);

    rerender(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    expect(screen.getByTestId('marca-name')).toHaveTextContent('No marca');
    expect(screen.getByTestId('plan-name')).toHaveTextContent('No plan');
    expect(screen.getByTestId('membresia-id')).toHaveTextContent('No membresia');
  });

  it('fetches trademark data when user is authenticated', async () => {
    const mockMarca = { id: 1, nombre: 'Test Marca', descripcion: 'Test Desc', logo: 'test.jpg', id_usuario: 1 };
    const mockMembresia = { id: 1, id_marca: 1, id_plan: 1, fecha_inicio: '2024-01-01', fecha_final: '2024-12-31' };
    const mockPlan = { id: 1, nombre: 'Plan Premium', descripcion: 'Premium plan', precio: 100, duracion: 12, espacio_extra: 5 };

    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    mockedMarcasService.getMarcaByUsuario.mockResolvedValue({
      data: { results: [mockMarca] }
    } as any);

    mockedMembresiasService.getMembresiaByMarca.mockResolvedValue({
      data: { results: [mockMembresia] }
    } as any);

    mockedPlanesService.getPlan.mockResolvedValue({
      data: mockPlan
    } as any);

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('marca-name')).toHaveTextContent('Test Marca');
    });

    expect(screen.getByTestId('plan-name')).toHaveTextContent('Plan Premium');
    expect(screen.getByTestId('membresia-id')).toHaveTextContent('1');
    expect(mockedMarcasService.getMarcaByUsuario).toHaveBeenCalledWith(1);
    expect(mockedMembresiasService.getMembresiaByMarca).toHaveBeenCalledWith(1);
    expect(mockedPlanesService.getPlan).toHaveBeenCalledWith(1);
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    mockedMarcasService.getMarcaByUsuario.mockRejectedValue(new Error('API Error'));

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    expect(screen.getByTestId('marca-name')).toHaveTextContent('No marca');
    
    consoleSpy.mockRestore();
  });

  it('handles missing marca response', async () => {
    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    mockedMarcasService.getMarcaByUsuario.mockResolvedValue({
      data: { results: [] }
    } as any);

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    await waitFor(() => {
      expect(mockedMarcasService.getMarcaByUsuario).toHaveBeenCalled();
    });

    expect(screen.getByTestId('marca-name')).toHaveTextContent('No marca');
    expect(mockedMembresiasService.getMembresiaByMarca).not.toHaveBeenCalled();
  });

  it('handles missing membresia response', async () => {
    const mockMarca = { id: 1, nombre: 'Test Marca', descripcion: 'Test Desc', logo: 'test.jpg', id_usuario: 1 };

    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    mockedMarcasService.getMarcaByUsuario.mockResolvedValue({
      data: { results: [mockMarca] }
    } as any);

    mockedMembresiasService.getMembresiaByMarca.mockResolvedValue({
      data: { results: [] }
    } as any);

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('marca-name')).toHaveTextContent('Test Marca');
    });

    expect(screen.getByTestId('membresia-id')).toHaveTextContent('No membresia');
    expect(mockedPlanesService.getPlan).not.toHaveBeenCalled();
  });

  it('allows updating gratis modal state', () => {
    mockedUseAuth.mockReturnValue({
      authState: { userId: null, accessToken: null },
    } as any);

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    expect(screen.getByTestId('gratis-modal')).toHaveTextContent('false');

    act(() => {
      screen.getByTestId('set-gratis-modal').click();
    });

    expect(screen.getByTestId('gratis-modal')).toHaveTextContent('true');
  });

  it('allows updating marca manually', () => {
    mockedUseAuth.mockReturnValue({
      authState: { userId: null, accessToken: null },
    } as any);

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    expect(screen.getByTestId('marca-name')).toHaveTextContent('No marca');

    act(() => {
      screen.getByTestId('set-marca').click();
    });

    expect(screen.getByTestId('marca-name')).toHaveTextContent('Manual Marca');
    expect(screen.getByTestId('marca-id')).toHaveTextContent('99');
  });

  it('context provides null when used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).not.toThrow();

    expect(screen.getByTestId('no-context')).toBeInTheDocument();
  });
});
