// tests/components/PrivateRoute.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from "../../../src/components/Epica1/PrivateRoute"

// Mock del hook de autenticación
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('PrivateRoute', () => {
  const ProtectedComponent = () => <div>Contenido Privado</div>;
  const PublicComponent = () => <div>Redirigido al inicio</div>;

  const renderWithRouter = (authUserId: string | null) => {
    const { useAuth } = require('@/hooks/useAuth');
    useAuth.mockReturnValue({
      authState: {
        userId: authUserId,
      },
    });

    return render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
          <Route
            path="/protegido"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<PublicComponent />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el contenido privado si el usuario está autenticado', () => {
    renderWithRouter('usuario123');
    expect(screen.getByText('Contenido Privado')).toBeInTheDocument();
  });

  it('redirige al inicio si el usuario no está autenticado', () => {
    renderWithRouter(null);
    expect(screen.getByText('Redirigido al inicio')).toBeInTheDocument();
  });
});
