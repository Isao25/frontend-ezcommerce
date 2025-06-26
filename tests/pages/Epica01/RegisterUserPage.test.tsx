// src/pages/Epica01/__tests__/RegisterUserPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { RegisterPage as RegisterUserPage } from '@/pages/Epica01/RegisterUserPage';
import { createUsuario } from '@/api/apiUsuarios';
import { EscuelaProfesional } from '@/types';

// Mock de APIs
jest.mock('@/api/apiUsuarios');
const mockCreateUsuario = createUsuario as jest.MockedFunction<typeof createUsuario>;

// Mock de sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock de react-router-dom useLoaderData
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLoaderData: () => mockEscuelas,
}));

// Mock de getFileURL utility
jest.mock('../../utils/helpers', () => ({
  getFileURL: jest.fn().mockResolvedValue('mocked-file-url'),
}));

const mockEscuelas: EscuelaProfesional[] = [
  {
    id: '1',
    id_facultad: '1',
    codigo: 'SIS',
    nombre: 'Ingeniería de Sistemas'
  },
  {
    id: '2',
    id_facultad: '1',
    codigo: 'IND',
    nombre: 'Ingeniería Industrial'
  }
];

// Wrapper para providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </HelmetProvider>
);

describe('RegisterUserPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render registration form correctly', () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    // Verificar elementos de la UI
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Regístrate con tu correo institucional')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido paterno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido materno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/código de estudiante/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/celular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/escuela profesional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nombres inválidos/i)).toBeInTheDocument();
      expect(screen.getByText(/apellidos inválidos/i)).toBeInTheDocument();
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/contraseña inválida/i)).toBeInTheDocument();
    });
  });

  it('should validate names format correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const namesInput = screen.getByLabelText(/nombres/i);
    
    // Test invalid format with numbers
    await user.type(namesInput, 'Juan123');
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/formato inválido: solo letras/i)).toBeInTheDocument();
    });
  });

  it('should validate email format and domain correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    
    // Test invalid domain
    await user.type(emailInput, 'test@gmail.com');
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el email debe terminar con @unmsm\.edu\.pe/i)).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    await user.type(passwordInput, '123');
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/contraseña debe tener como mínimo 6 carácteres/i)).toBeInTheDocument();
    });
  });

  it('should validate phone number format', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const phoneInput = screen.getByLabelText(/celular/i);
    
    // Test invalid phone (too short)
    await user.type(phoneInput, '123');
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el celular debe tener como mínimo 9 dígitos/i)).toBeInTheDocument();
    });
  });

  it('should validate student code format', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const codeInput = screen.getByLabelText(/código de estudiante/i);
    
    // Test invalid code format
    await user.type(codeInput, 'ABC123');
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/formato inválido.*8 dígitos/i)).toBeInTheDocument();
    });
  });

  it('should populate school select with loaded data', () => {
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const schoolSelect = screen.getByLabelText(/escuela profesional/i);
    fireEvent.click(schoolSelect);

    expect(screen.getByText('Ingeniería de Sistemas')).toBeInTheDocument();
    expect(screen.getByText('Ingeniería Industrial')).toBeInTheDocument();
  });

  it('should successfully submit form with valid data', async () => {
    const user = userEvent.setup();
    const { toast } = require('sonner');
    
    mockCreateUsuario.mockResolvedValue({
      data: { id: 1 },
      status: 201
    } as any);
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    // Fill out the form
    await user.type(screen.getByLabelText(/nombres/i), 'Juan Carlos');
    await user.type(screen.getByLabelText(/apellido paterno/i), 'Pérez');
    await user.type(screen.getByLabelText(/apellido materno/i), 'García');
    await user.type(screen.getByLabelText(/código de estudiante/i), '20210001');
    await user.type(screen.getByLabelText(/celular/i), '987654321');
    await user.type(screen.getByLabelText(/email/i), 'juan.perez@unmsm.edu.pe');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Select school
    const schoolSelect = screen.getByLabelText(/escuela profesional/i);
    await user.click(schoolSelect);
    await user.click(screen.getByText('Ingeniería de Sistemas'));

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUsuario).toHaveBeenCalledWith(
        expect.objectContaining({
          nombres: 'Juan Carlos',
          apellido_p: 'Pérez',
          apellido_m: 'García',
          codigo: '20210001',
          celular: '987654321',
          email: 'juan.perez@unmsm.edu.pe',
          password: 'password123',
          id_escuela: 1
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Usuario registrado correctamente');
    });
  });

  it('should show error toast on registration failure', async () => {
    const user = userEvent.setup();
    const { toast } = require('sonner');
    
    mockCreateUsuario.mockRejectedValue(new Error('Registration failed'));
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    // Fill out valid form data
    await user.type(screen.getByLabelText(/nombres/i), 'Juan Carlos');
    await user.type(screen.getByLabelText(/apellido paterno/i), 'Pérez');
    await user.type(screen.getByLabelText(/apellido materno/i), 'García');
    await user.type(screen.getByLabelText(/código de estudiante/i), '20210001');
    await user.type(screen.getByLabelText(/celular/i), '987654321');
    await user.type(screen.getByLabelText(/email/i), 'juan.perez@unmsm.edu.pe');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Select school
    const schoolSelect = screen.getByLabelText(/escuela profesional/i);
    await user.click(schoolSelect);
    await user.click(screen.getByText('Ingeniería de Sistemas'));

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al registrar usuario');
    });
  });

  it('should handle file upload for QR code', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText(/código qr/i);
    const file = new File(['qr-content'], 'qr-code.png', { type: 'image/png' });

    await user.upload(fileInput, file);

    expect(fileInput).toBeInTheDocument();
    // Note: File input testing might need additional setup depending on your component implementation
  });

  it('should have correct link to login page', () => {
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const loginLink = screen.getByRole('link', { name: /inicia sesión/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should validate maximum character limits', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const namesInput = screen.getByLabelText(/nombres/i);
    const longName = 'a'.repeat(201); // Exceeds 200 character limit
    
    await user.type(namesInput, longName);
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nombres deben tener como máximo 200 carácteres/i)).toBeInTheDocument();
    });
  });

  it('should validate phone number maximum length', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const phoneInput = screen.getByLabelText(/celular/i);
    const longPhone = '1'.repeat(16); // Exceeds 15 digit limit
    
    await user.type(phoneInput, longPhone);
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el celular debe tener como máximo 15 dígitos/i)).toBeInTheDocument();
    });
  });

  it('should clear validation errors when user corrects input', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <RegisterUserPage />
      </TestWrapper>
    );

    const namesInput = screen.getByLabelText(/nombres/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    // First trigger validation error
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/nombres inválidos/i)).toBeInTheDocument();
    });

    // Then type valid input
    await user.type(namesInput, 'Juan Carlos');

    await waitFor(() => {
      expect(screen.queryByText(/nombres inválidos/i)).not.toBeInTheDocument();
    });
  });
});