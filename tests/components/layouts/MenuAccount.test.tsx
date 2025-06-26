import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MenuAccount } from '@/components/layouts/MenuAccount';
import { createMockAuthUser, createMockUnauthUser } from '../../utils/test-utils';
import { useAuth } from '../../../src/hooks/useAuth';
import { getUsuarios } from '../../../src/api/apiUsuarios';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('../../../src/hooks/useAuth');
jest.mock('../../../src/api/apiUsuarios');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedGetUsuarios = getUsuarios as jest.MockedFunction<typeof getUsuarios>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('MenuAccount', () => {
  const mockUserData = {
    nombres: 'Juan Carlos',
    apellido_p: 'Pérez',
    apellido_m: 'García',
    email: 'juan@test.com',
    username: 'juan123',
    celular: '987654321',
    codigo: '12345678',
    id_escuela: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetUsuarios.mockResolvedValue({ data: mockUserData } as any);
  });

  it('renders dropdown trigger button', () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton.querySelector('svg')).toBeInTheDocument(); // User icon
  });

  it('displays user information when authenticated', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    // Click to open dropdown
    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText('Juan Carlos Pérez')).toBeInTheDocument();
      expect(screen.getByText('García')).toBeInTheDocument();
    });
  });

  it('loads user data when userId is available', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser(123));

    render(<MenuAccount />);

    await waitFor(() => {
      expect(mockedGetUsuarios).toHaveBeenCalledWith(123);
    });
  });

  it('renders all menu options for authenticated users', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText('Gestión de compras')).toBeInTheDocument();
      expect(screen.getByText('Publicar anuncio')).toBeInTheDocument();
      expect(screen.getByText('Configuración')).toBeInTheDocument();
      expect(screen.getByText('Ayuda y soporte tecnico')).toBeInTheDocument();
      expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
    });
  });

  it('navigates to correct routes when menu items are clicked', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      const purchaseManagementLink = screen.getByRole('link', { name: /gestión de compras/i });
      expect(purchaseManagementLink).toHaveAttribute('href', '/purchase-management');

      const configurationLink = screen.getByRole('link', { name: /configuración/i });
      expect(configurationLink).toHaveAttribute('href', '/profile-buyer');
    });
  });

  it('shows error toast for unauthenticated users clicking menu items', async () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      // Find a button that's not the trigger (has text content)
      const menuButton = buttons.find(btn => 
        btn.textContent?.includes('Gestión de compras')
      );
      
      if (menuButton) {
        fireEvent.click(menuButton);
        expect(mockedToast.error).toHaveBeenCalledWith('Inicie sesión para acceder a este módulo');
      }
    });
  });

  it('handles logout functionality', async () => {
    const mockLogout = jest.fn();
    mockedUseAuth.mockReturnValue({
      ...createMockAuthUser(),
      logout: mockLogout,
    });

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      const logoutLink = screen.getByRole('link', { name: /cerrar sesión/i });
      fireEvent.click(logoutLink);
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockedToast.success).toHaveBeenCalledWith('Sesión terminada');
  });

  it('renders avatar component in menu header', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      // Avatar should be present in the dropdown
      const avatarElements = screen.getAllByRole('img', { hidden: true });
      expect(avatarElements.length).toBeGreaterThan(0);
    });
  });

  it('displays icons for each menu option', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      // Each menu item should have an icon wrapper
      const iconWrappers = screen.getAllByRole('link').concat(screen.getAllByRole('button'));
      iconWrappers.forEach(wrapper => {
        if (wrapper.textContent && wrapper.textContent.length > 1) {
          const iconElement = wrapper.querySelector('svg') || wrapper.querySelector('.bg-gray-300');
          expect(iconElement).toBeInTheDocument();
        }
      });
    });
  });

  it('handles API error when loading user data', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    mockedGetUsuarios.mockRejectedValue(new Error('API Error'));
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    await waitFor(() => {
      expect(mockedGetUsuarios).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  it('does not load user data when userId is null', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<MenuAccount />);

    expect(mockedGetUsuarios).not.toHaveBeenCalled();
  });

  it('shows chevron icons in menu items', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      // Look for ChevronRight icons in menu items
      const menuItems = screen.getAllByRole('link');
      menuItems.forEach(item => {
        if (item.textContent && !item.textContent.includes('Cerrar sesión')) {
          const chevronIcon = item.querySelector('svg[class*="ml-4"]');
          expect(chevronIcon).toBeInTheDocument();
        }
      });
    });
  });

  it('applies correct styling to menu items', async () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      const menuItems = screen.getAllByRole('menuitem');
      menuItems.forEach(item => {
        expect(item).toHaveClass('py-2');
      });
    });
  });

  it('displays user name fallback when API returns incomplete data', async () => {
    const incompleteUserData = {
      nombres: 'Juan',
      apellido_p: null,
      apellido_m: null,
    };
    
    mockedGetUsuarios.mockResolvedValue({ data: incompleteUserData } as any);
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<MenuAccount />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText('Juan')).toBeInTheDocument();
    });
  });
});
