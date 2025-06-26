import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TrademarkProvider, TrademarkContext } from '../../src/context/TrademarkContext';
import * as apiMarcas from '../../src/api/apiMarcas';
import { useAuth } from '../../src/hooks/useAuth';

// Mock dependencies
jest.mock('../../src/api/apiMarcas');
jest.mock('../../src/hooks/useAuth');

const mockedApiMarcas = apiMarcas as jest.Mocked<typeof apiMarcas>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Test component to consume context
const TestComponent = () => {
  const context = React.useContext(TrademarkContext);
  
  if (!context) return <div>No context</div>;
  
  return (
    <div>
      <div data-testid="marca-name">{context.marca?.nombre || 'No marca'}</div>
      <div data-testid="plan-name">{context.plan?.nombre || 'No plan'}</div>
      <div data-testid="membresia-id">{context.membresia?.id || 'No membresia'}</div>
      <div data-testid="gratis-modal">{context.gratisModal.toString()}</div>
    </div>
  );
};

describe('TrademarkContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock API services
    mockedApiMarcas.marcasService = {
      getMarcaByUsuario: jest.fn(),
    } as any;

    mockedApiMarcas.membresiasService = {
      getMembresiaByMarca: jest.fn(),
    } as any;

    mockedApiMarcas.planesService = {
      getPlan: jest.fn(),
    } as any;
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

  it('fetches trademark data when user is authenticated', async () => {
    const mockMarca = { id: 1, nombre: 'Test Marca', descripcion: 'Test Desc', logo: 'test.jpg', id_usuario: 1 };
    const mockMembresia = { id: 1, id_marca: 1, id_plan: 1, fecha_inicio: '2024-01-01', fecha_final: '2024-12-31' };
    const mockPlan = { id: 1, nombre: 'Plan Premium', descripcion: 'Premium plan', precio: 100, duracion: 12, espacio_extra: 5 };

    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    mockedApiMarcas.marcasService.getMarcaByUsuario.mockResolvedValue({
      data: { results: [mockMarca] }
    } as any);

    mockedApiMarcas.membresiasService.getMembresiaByMarca.mockResolvedValue({
      data: { results: [mockMembresia] }
    } as any);

    mockedApiMarcas.planesService.getPlan.mockResolvedValue({
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
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    mockedApiMarcas.marcasService.getMarcaByUsuario.mockRejectedValue(new Error('API Error'));

    render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Fetching error', expect.any(Error));
    });

    expect(screen.getByTestId('marca-name')).toHaveTextContent('No marca');
    
    consoleSpy.mockRestore();
  });

  it('resets state when user logs out', async () => {
    const { rerender } = render(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    // First render with authenticated user
    mockedUseAuth.mockReturnValue({
      authState: { userId: 1, accessToken: 'token' },
    } as any);

    rerender(
      <TrademarkProvider>
        <TestComponent />
      </TrademarkProvider>
    );

    // Then simulate logout
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
});
