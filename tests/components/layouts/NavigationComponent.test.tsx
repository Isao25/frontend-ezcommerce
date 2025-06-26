import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { NavigationComponent } from '@/components/layouts/NavigationComponent';

// Mock the hooks and components
const mockNavigate = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

jest.mock('../SheetComponent', () => ({
  SheetComponent: () => <div data-testid="sheet-component">SheetComponent</div>
}));

const NavigationComponentWithRouter = () => (
  <BrowserRouter>
    <NavigationComponent />
  </BrowserRouter>
);

describe('NavigationComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      authState: { userId: null },
      setLoginModal: jest.fn()
    });
  });

  it('renders the navigation menu', () => {
    render(<NavigationComponentWithRouter />);
    
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('renders the sheet component', () => {
    render(<NavigationComponentWithRouter />);
    
    expect(screen.getByTestId('sheet-component')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<NavigationComponentWithRouter />);
    
    expect(screen.getByText('Venta')).toBeInTheDocument();
    expect(screen.getByText('Vendedores estudiantiles')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('navigates to correct pages when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      authState: { userId: 123 },
      setLoginModal: jest.fn()
    });
    
    render(<NavigationComponentWithRouter />);
    
    const ventaButton = screen.getByText('Venta');
    fireEvent.click(ventaButton);
    expect(mockNavigate).toHaveBeenCalledWith('/products-management');
    
    const vendedoresButton = screen.getByText('Vendedores estudiantiles');
    fireEvent.click(vendedoresButton);
    expect(mockNavigate).toHaveBeenCalledWith('/sellers');
    
    const chatButton = screen.getByText('Chat');
    fireEvent.click(chatButton);
    expect(mockNavigate).toHaveBeenCalledWith('/chat');
  });

  it('shows login modal when user is not authenticated', () => {
    const mockSetLoginModal = jest.fn();
    mockUseAuth.mockReturnValue({
      authState: { userId: null },
      setLoginModal: mockSetLoginModal
    });
    
    render(<NavigationComponentWithRouter />);
    
    const ventaButton = screen.getByText('Venta');
    fireEvent.click(ventaButton);
    
    expect(mockSetLoginModal).toHaveBeenCalledWith(true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles navigation for "Vendedores estudiantiles" correctly for unauthenticated user', () => {
    const mockSetLoginModal = jest.fn();
    mockUseAuth.mockReturnValue({
      authState: { userId: null },
      setLoginModal: mockSetLoginModal
    });
    
    render(<NavigationComponentWithRouter />);
    
    const vendedoresButton = screen.getByText('Vendedores estudiantiles');
    fireEvent.click(vendedoresButton);
    
    expect(mockSetLoginModal).toHaveBeenCalledWith(true);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});