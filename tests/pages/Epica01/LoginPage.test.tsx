// src/pages/Epica01/__tests__/LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LoginPage } from '@/pages/Epica01';
import { useAuth } from '@/hooks/useAuth';

// Mock de hooks y componentes
jest.mock('@/hooks/useAuth');
jest.mock('@/components/Epica08', () => ({
  RecoverAccountModal: () => <div data-testid="recover-account-modal">Recover Account Modal</div>
}));

// Mock de react-router-dom Navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => {
    mockNavigate(to);
    return <div data-testid="navigate" data-to={to}>Navigating to {to}</div>;
  },
}));

// Mock de sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Wrapper para providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </HelmetProvider>
);

describe('LoginPage', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      authState: { isAuthenticated: false, userId: null },
      logout: jest.fn(),
      loginModal: false,
      setLoginModal: jest.fn(),
    });
  });

  it('should render login form correctly', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    // Verificar elementos de la UI
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Inicia sesión con tu correo institucional')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByText(/¿no tienes cuenta\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /regístrate/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await user.type(emailInput, 'test@unmsm.edu.pe');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/contraseña debe tener como mínimo 6 carácteres/i)).toBeInTheDocument();
    });
  });

  it('should call login function with correct credentials', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await user.type(emailInput, 'test@unmsm.edu.pe');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@unmsm.edu.pe', 'password123');
    });
  });

  it('should navigate to home on successful login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await user.type(emailInput, 'test@unmsm.edu.pe');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
    });
  });

  it('should show error toast on login failure', async () => {
    const user = userEvent.setup();
    const { toast } = require('sonner');
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    await user.type(emailInput, 'test@unmsm.edu.pe');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciales equivocadas');
    });
  });

  it('should render recover account modal', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByTestId('recover-account-modal')).toBeInTheDocument();
  });

  it('should have correct link to register page', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const registerLink = screen.getByRole('link', { name: /regístrate/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('should validate email with maximum length', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const longEmail = 'a'.repeat(250) + '@test.com'; // Email muy largo
    
    await user.type(emailInput, longEmail);
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email debe tener como máximo 254 caracteres/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission with keyboard', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(emailInput, 'test@unmsm.edu.pe');
    await user.type(passwordInput, 'password123');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@unmsm.edu.pe', 'password123');
    });
  });

  it('should clear form validation errors when user starts typing', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });

    // Primero trigger validation error
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });

    // Luego escribir algo válido
    await user.type(emailInput, 'test@unmsm.edu.pe');

    // La validación debería actualizarse
    await waitFor(() => {
      expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    });
  });
});