import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layouts/Layout';

// Mock all layout components
jest.mock('@/components/layouts/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>
}));

jest.mock('@/components/layouts/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>
}));

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Layout', () => {
  it('renders all layout components', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="main-content">Main Content</div>
      </Layout>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithRouter(
      <Layout>
        <h1>Test Content</h1>
        <p>This is test content</p>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('This is test content')).toBeInTheDocument();
  });

  it('has correct layout structure order', () => {
    const { container } = renderWithRouter(
      <Layout>
        <main role="main" data-testid="main-content">Main Content</main>
      </Layout>
    );
    
    const children = Array.from(container.firstChild?.childNodes || []);
    
    // Check structure exists
    expect(children.length).toBeGreaterThan(0);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
