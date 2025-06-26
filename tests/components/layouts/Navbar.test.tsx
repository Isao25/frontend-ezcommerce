import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { NavigationComponent } from '@/components/layouts/NavigationComponent';
import { useAuth } from '@/hooks/useAuth';
import * as router from 'react-router';

jest.mock('@/hooks/useAuth');
jest.mock('@/components/layouts/SheetComponent', () => ({
  SheetComponent: () => <div data-testid="sheet-component">Sheet Component</div>
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockNavigate = jest.fn();
const mockSetLoginModal = jest.fn();

jest.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NavigationComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      authState: { isAuthenticated: true, userId: 123 },
      logout: jest.fn(),
      login: jest.fn(),
      loginModal: false,
      setLoginModal: mockSetLoginModal,
    });
  });

  it('renders navigation items', () => {
    renderWithRouter(<NavigationComponent />);
    
    expect(screen.getByTestId('sheet-component')).toBeInTheDocument();
    expect(screen.getByText('Venta')).toBeInTheDocument();
    expect(screen.getByText('Vendedores estudiantiles')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('navigates when authenticated user clicks navigation item', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NavigationComponent />);
    
    await user.click(screen.getByText('Venta'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/products-management');
  });

  it('shows login modal when unauthenticated user clicks navigation item', async () => {
    mockUseAuth.mockReturnValue({
      authState: { isAuthenticated: false, userId: null },
      logout: jest.fn(),
      login: jest.fn(),
      loginModal: false,
      setLoginModal: mockSetLoginModal,
    });
    
    const user = userEvent.setup();
    renderWithRouter(<NavigationComponent />);
    
    await user.click(screen.getByText('Venta'));
    
    expect(mockSetLoginModal).toHaveBeenCalledWith(true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles all navigation items correctly', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NavigationComponent />);
    
    await user.click(screen.getByText('Vendedores estudiantiles'));
    expect(mockNavigate).toHaveBeenCalledWith('/sellers');
    
    await user.click(screen.getByText('Chat'));
    expect(mockNavigate).toHaveBeenCalledWith('/chat');
  });

  it('renders NavigationMenu structure', () => {
    const { container } = renderWithRouter(<NavigationComponent />);
    
    expect(container.querySelector('[role="navigation"]')).toBeInTheDocument();
  });
});

