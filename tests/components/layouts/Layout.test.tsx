import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layouts/Layout';

// Mock the child components
jest.mock('@/components/layouts/Navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>
}));

jest.mock('@/components/layouts/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>
}));

jest.mock('sonner', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>
}));

const LayoutWithRouter = ({ children }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={children || <div>Test Content</div>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

describe('Layout', () => {
  it('renders all layout components', () => {
    render(<LayoutWithRouter />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('renders main content area with proper classes', () => {
    render(<LayoutWithRouter />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('px-4', 'sm:px-6', 'md:px-16', 'lg:px-32');
  });

  it('renders outlet content', () => {
    render(
      <LayoutWithRouter>
        <div>Custom Page Content</div>
      </LayoutWithRouter>
    );
    
    expect(screen.getByText('Custom Page Content')).toBeInTheDocument();
  });

  it('has correct layout structure order', () => {
    render(<LayoutWithRouter />);
    
    const container = screen.getByTestId('navbar').parentElement;
    const children = Array.from(container?.children || []);
    
    expect(children[0]).toHaveAttribute('data-testid', 'navbar');
    expect(children[1]).toHaveAttribute('role', 'main');
    expect(children[2]).toHaveAttribute('data-testid', 'toaster');
    expect(children[3]).toHaveAttribute('data-testid', 'footer');
  });
});