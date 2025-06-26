import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MenuAccount } from '@/components/layouts/MenuAccount';
import { useAuth } from '@/hooks/useAuth';
import { getUsuarios } from '@/api/apiUsuarios';
import { toast } from 'sonner';

// Mocks
jest.mock('@/hooks/useAuth');
jest.mock('@/api/apiUsuarios');
jest.mock('sonner');
jest.mock('@/components/layouts/AvatarComponent', () => ({
  AvatarComponent: () => <div data-testid="avatar-component">Avatar</div>
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockGetUsuarios = getUsuarios as jest.MockedFunction<typeof getUsuarios>;
const mockToast = toast as jest.Mocked<typeof toast>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MenuAccount Component', () => {
  const mockLogout = jest.fn();
  const mockUser = { nombres: 'Juan', apellido_p: 'Pérez', apellido_m: 'García' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      authState: { isAuthenticated: true, userId: 123 },
      logout: mockLogout,
      login: jest.fn(),
      loginModal: false,
      setLoginModal: jest.fn(),
    });
    mockGetUsuarios.mockResolvedValue({ data: mockUser } as any);
  });

  it('renders dropdown menu trigger button', () => {
    renderWithRouter(<MenuAccount />);
    const triggerButton = screen.getByRole('button');
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MenuAccount />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('avatar-component')).toBeInTheDocument();
    });
  });

  it('displays user information when authenticated', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MenuAccount />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
      expect(screen.getByText(/García/)).toBeInTheDocument();
    });
  });

  it('renders all menu options', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MenuAccount />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Gestión de compras')).toBeInTheDocument();
      expect(screen.getByText('Publicar anuncio')).toBeInTheDocument();
      expect(screen.getByText('Configuración')).toBeInTheDocument();
      expect(screen.getByText('Ayuda y soporte tecnico')).toBeInTheDocument();
      expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
    });
  });

  it('shows toast error for unauthenticated user', async () => {
    mockUseAuth.mockReturnValue({
      authState: { isAuthenticated: false, userId: null },
      logout: mockLogout,
      login: jest.fn(),
      loginModal: false,
      setLoginModal: jest.fn(),
    });
    
    const user = userEvent.setup();
    renderWithRouter(<MenuAccount />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      const gestionButton = screen.getByText('Gestión de compras').closest('button');
      return user.click(gestionButton!);
    });
    
    expect(mockToast.error).toHaveBeenCalledWith('Inicie sesión para acceder a este módulo');
  });

  it('calls logout and shows success toast', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MenuAccount />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      const logoutLink = screen.getByText('Cerrar sesión');
      return user.click(logoutLink);
    });
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith('Sesión terminada');
  });

  it('fetches user data on mount', async () => {
    renderWithRouter(<MenuAccount />);
    
    await waitFor(() => {
      expect(mockGetUsuarios).toHaveBeenCalledWith(123);
    });
  });

  it('does not fetch user data when userId is null', () => {
    mockUseAuth.mockReturnValue({
      authState: { isAuthenticated: false, userId: null },
      logout: mockLogout,
      login: jest.fn(),
      loginModal: false,
      setLoginModal: jest.fn(),
    });
    
    renderWithRouter(<MenuAccount />);
    
    expect(mockGetUsuarios).not.toHaveBeenCalled();
  });
});

