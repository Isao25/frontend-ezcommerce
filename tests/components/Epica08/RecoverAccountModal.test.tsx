import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecoverAccountModal } from '@/components/Epica08/RecoverAccountModal';
import { BrowserRouter } from 'react-router-dom';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RecoverAccountModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders trigger text', () => {
    renderWithRouter(<RecoverAccountModal />);

    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  test('opens modal when trigger clicked', () => {
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    expect(screen.getByText('Recuperar cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('usuario@unmsm.edu.pe')).toBeInTheDocument();
  });

  test('validates email input in first step', async () => {
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    const emailInput = screen.getByPlaceholderText('usuario@unmsm.edu.pe');
    const submitButton = screen.getByText('Enviar Correo');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  test('proceeds to verification step with valid email', async () => {
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    const emailInput = screen.getByPlaceholderText('usuario@unmsm.edu.pe');
    const submitButton = screen.getByText('Enviar Correo');

    fireEvent.change(emailInput, { target: { value: 'test@unmsm.edu.pe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Código de verificación')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('12345678')).toBeInTheDocument();
    });
  });

  test('proceeds to password reset step with valid code', async () => {
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // First step
    const emailInput = screen.getByPlaceholderText('usuario@unmsm.edu.pe');
    fireEvent.change(emailInput, { target: { value: 'test@unmsm.edu.pe' } });
    fireEvent.click(screen.getByText('Enviar Correo'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('12345678')).toBeInTheDocument();
    });

    // Second step
    const codeInput = screen.getByPlaceholderText('12345678');
    fireEvent.change(codeInput, { target: { value: '12345678' } });
    fireEvent.click(screen.getByText('Verificar código'));

    await waitFor(() => {
      expect(screen.getByText('Nueva Contraseña')).toBeInTheDocument();
      expect(screen.getByText('Confirmar Contraseña')).toBeInTheDocument();
    });
  });

  test('validates password confirmation', async () => {
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Navigate to final step (simulated)
    const emailInput = screen.getByPlaceholderText('usuario@unmsm.edu.pe');
    fireEvent.change(emailInput, { target: { value: 'test@unmsm.edu.pe' } });
    fireEvent.click(screen.getByText('Enviar Correo'));

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText('12345678');
      fireEvent.change(codeInput, { target: { value: '12345678' } });
      fireEvent.click(screen.getByText('Verificar código'));
    });

    await waitFor(() => {
      const newPasswordInput = screen.getByPlaceholderText('Coloca tu nueva contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirma la nueva contraseña');
      
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      
      fireEvent.click(screen.getByText('Restablecer contraseña'));
    });

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  test('successfully resets password', async () => {
    const { toast } = require('sonner');
    
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Navigate through all steps
    const emailInput = screen.getByPlaceholderText('usuario@unmsm.edu.pe');
    fireEvent.change(emailInput, { target: { value: 'test@unmsm.edu.pe' } });
    fireEvent.click(screen.getByText('Enviar Correo'));

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText('12345678');
      fireEvent.change(codeInput, { target: { value: '12345678' } });
      fireEvent.click(screen.getByText('Verificar código'));
    });

    await waitFor(() => {
      const emailInput2 = screen.getByPlaceholderText('usuario@unmsm.edu.pe');
      const newPasswordInput = screen.getByPlaceholderText('Coloca tu nueva contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirma la nueva contraseña');
      
      fireEvent.change(emailInput2, { target: { value: 'test@unmsm.edu.pe' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
      
      fireEvent.click(screen.getByText('Restablecer contraseña'));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Contraseña restablecida exitosamente');
    });
  });

  test('closes modal when close button clicked', () => {
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Recuperar cuenta')).not.toBeInTheDocument();
  });

  test('shows contact support option in final step', async () => {
    renderWithRouter(<RecoverAccountModal />);

    fireEvent.click(screen.getByText('¿Olvidaste tu contraseña?'));

    // Navigate to final step
    const emailInput = screen.getByPlaceholderText('usuario@unmsm.edu.pe');
    fireEvent.change(emailInput, { target: { value: 'test@unmsm.edu.pe' } });
    fireEvent.click(screen.getByText('Enviar Correo'));

    await waitFor(() => {
      const codeInput = screen.getByPlaceholderText('12345678');
      fireEvent.change(codeInput, { target: { value: '12345678' } });
      fireEvent.click(screen.getByText('Verificar código'));
    });

    await waitFor(() => {
      expect(screen.getByText('¿Necesitas más ayuda?')).toBeInTheDocument();
      expect(screen.getByText('Contactar soporte')).toBeInTheDocument();
    });
  });
});