// src/hooks/__tests__/useTrademark.test.tsx
import { renderHook } from '@testing-library/react';
import { useTrademark } from '@/hooks/useTrademark';
import { TrademarkContext } from '@/context/TrademarkContext';
import { ReactNode } from 'react';
import { Marca, Plan, Membresia } from '@/types';

// Mock del contexto
const mockTrademarkContext = {
  marca: null as Marca | null,
  setMarca: jest.fn(),
  membresia: null as Membresia | null,
  plan: null as Plan | null,
  gratisModal: false,
  setGratisModal: jest.fn(),
};

// Wrapper del proveedor
const TrademarkWrapper = ({ children }: { children: ReactNode }) => (
  <TrademarkContext.Provider value={mockTrademarkContext}>
    {children}
  </TrademarkContext.Provider>
);

// Wrapper sin proveedor para testing del error
const WithoutProviderWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

describe('useTrademark hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return context value when used within TrademarkProvider', () => {
    const { result } = renderHook(() => useTrademark(), {
      wrapper: TrademarkWrapper,
    });

    expect(result.current).toEqual(mockTrademarkContext);
  });

  it('should throw error when used outside TrademarkProvider', () => {
    // Silenciar errores de consola para esta prueba
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useTrademark(), {
        wrapper: WithoutProviderWrapper,
      });
    }).toThrow('useTrademark must be used within an TrademarkProvider');

    // Restaurar console.error
    console.error = originalError;
  });

  it('should return updated context when marca changes', () => {
    const mockMarca: Marca = {
      id: 1,
      id_usuario: 1,
      nombre: 'Test Brand',
      descripcion: 'Test Description',
      logo: 'test-logo.png'
    };

    const updatedContext = {
      ...mockTrademarkContext,
      marca: mockMarca,
    };

    const { result, rerender } = renderHook(() => useTrademark(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <TrademarkContext.Provider value={updatedContext}>
          {children}
        </TrademarkContext.Provider>
      ),
    });

    expect(result.current.marca).toEqual(mockMarca);
    expect(result.current.setMarca).toBe(updatedContext.setMarca);
  });

  it('should return updated context when plan changes', () => {
    const mockPlan: Plan = {
      id: 1,
      nombre: 'Premium',
      descripcion: 'Plan premium',
      espacio_extra: 100,
      duracion: 30,
      precio: 29.99,
      beneficios: ['Benefit 1', 'Benefit 2']
    };

    const updatedContext = {
      ...mockTrademarkContext,
      plan: mockPlan,
    };

    const { result } = renderHook(() => useTrademark(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <TrademarkContext.Provider value={updatedContext}>
          {children}
        </TrademarkContext.Provider>
      ),
    });

    expect(result.current.plan).toEqual(mockPlan);
  });

  it('should return updated context when gratisModal changes', () => {
    const updatedContext = {
      ...mockTrademarkContext,
      gratisModal: true,
    };

    const { result } = renderHook(() => useTrademark(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <TrademarkContext.Provider value={updatedContext}>
          {children}
        </TrademarkContext.Provider>
      ),
    });

    expect(result.current.gratisModal).toBe(true);
    expect(result.current.setGratisModal).toBe(updatedContext.setGratisModal);
  });
});
