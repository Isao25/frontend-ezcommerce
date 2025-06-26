import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../../src/context/AuthContext';
import { TrademarkProvider } from '../../src/context/TrademarkContext';
import { EtiquetasProvider } from '../../src/context/EtiquetasContext';
import { FavouritesProvider } from '../../src/context/FavouritesContext';
import { CartProvider } from '../../src/context/CartContext';

// All the providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <EtiquetasProvider>
          <AuthProvider>
            <TrademarkProvider>
              <FavouritesProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </FavouritesProvider>
            </TrademarkProvider>
          </AuthProvider>
        </EtiquetasProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock factory for authenticated user
export const createMockAuthUser = (userId: number = 1, accessToken: string = 'mock-token') => ({
  authState: { userId, accessToken },
  loginModal: false,
  setLoginModal: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
});

// Mock factory for unauthenticated user
export const createMockUnauthUser = () => ({
  authState: { userId: null, accessToken: null },
  loginModal: false,
  setLoginModal: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
});

// Mock factory for trademark context
export const createMockTrademark = () => ({
  marca: {
    id: 1,
    nombre: 'Test Marca',
    descripcion: 'Test Description',
    logo: 'test-logo.jpg',
    id_usuario: 1
  },
  setMarca: jest.fn(),
  membresia: {
    id: 1,
    id_marca: 1,
    id_plan: 1,
    fecha_inicio: '2024-01-01',
    fecha_final: '2024-12-31'
  },
  plan: {
    id: 1,
    nombre: 'Premium Plan',
    descripcion: 'Premium Description',
    precio: 100,
    duracion: 12,
    espacio_extra: 5
  },
  gratisModal: false,
  setGratisModal: jest.fn(),
});

// Export everything
export * from '@testing-library/react';
export { customRender as render };
