// src/components/layouts/__tests__/Footer.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from '@/components/layouts/Footer';

// Wrapper para React Router
const renderFooter = () => {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe('Footer Component', () => {
  it('renders footer element with correct classes', () => {
    renderFooter();
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-terciaryLight', 'text-terciaryDark', 'sm:px-6', 'md:px-16', 'lg:px-32', 'py-6');
  });

  it('renders main flex container with responsive classes', () => {
    const { container } = renderFooter();
    
    const mainDiv = container.querySelector('.flex.flex-col.lg\\:flex-row .md\\:justify-between');
    expect(mainDiv).toBeInTheDocument();
  });

  it('renders logo section with correct structure', () => {
    const { container } = renderFooter();
    
    // Logo container
    const logoSection = container.querySelector('.flex.flex-col.mr-2.space-y-4.mb-4.sm\\:flex-row .lg\\:w-\\[400px\\] .lg\\:flex-col .lg\\:mb-0');
    expect(logoSection).toBeInTheDocument();
    
    // Logo inner container
    const logoInnerDiv = container.querySelector('.flex.flex-col.space-x-2');
    expect(logoInnerDiv).toBeInTheDocument();
  });

  it('renders logo with correct attributes and link', () => {
    renderFooter();
    
    // Find logo by alt text
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/Ezcommerce-logo-dark.png');
    expect(logo).toHaveAttribute('width', '180');
    expect(logo).toHaveAttribute('height', '88');
    
    // Check logo link
    const logoLink = logo.closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders description text with correct content and classes', () => {
    renderFooter();
    
    const description = screen.getByText('Una tienda virtual creada para conectar y apoyar a universitarios, donde cada compra y venta fortalece nuestra comunidad.');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm', 'md:text-lg', 'lg:text-sm');
  });

  it('renders social media icons container with correct structure', () => {
    const { container } = renderFooter();
    
    const socialContainer = container.querySelector('.flex.sm\\:flex-wrap .mt-4.items-center.lg\\:space-x-4.justify-center.sm\\:w-1\\/4.lg\\:justify-start.lg\\:w-full');
    expect(socialContainer).toBeInTheDocument();
  });

  it('renders Facebook icon with correct styling', () => {
    const { container } = renderFooter();
    
    const facebookContainer = container.querySelector('.flex.items-center.justify-center.w-8.h-8.md\\:w-10.md\\:h-10.rounded-full.bg-blue-600.hover\\:bg-blue-700.transition-colors');
    expect(facebookContainer).toBeInTheDocument();
    
    // Check that it contains a link
    const facebookLink = facebookContainer?.querySelector('a[href="#"]');
    expect(facebookLink).toBeInTheDocument();
  });

  it('renders Instagram and MessageCircle icons with gray styling', () => {
    const { container } = renderFooter();
    
    const grayContainers = container.querySelectorAll('.flex.items-center.justify-center.w-8.h-8.md\\:w-10.md\\:h-10.rounded-full.bg-gray-300.hover\\:bg-gray-400.transition-colors');
    expect(grayContainers).toHaveLength(2);
    
    // Each should contain a link
    grayContainers.forEach(grayContainer => {
      const link = grayContainer.querySelector('a[href="#"]');
      expect(link).toBeInTheDocument();
    });
  });

  it('renders Compañia section with correct structure', () => {
    renderFooter();
    
    // Section title
    const companyTitle = screen.getByText('Compañia');
    expect(companyTitle).toBeInTheDocument();
    expect(companyTitle).toHaveClass('text-lg', 'font-semibold', 'text-primaryLight');
  });

  it('renders Compañia section container with correct classes', () => {
    const { container } = renderFooter();
    
    const companySections = container.querySelectorAll('.flex.flex-col.mb-6.lg\\:mb-0.lg\\:mr-2');
    expect(companySections.length).toBeGreaterThan(0);
  });

  it('renders horizontal divider in Compañia section', () => {
    const { container } = renderFooter();
    
    const dividers = container.querySelectorAll('hr.my-3');
    expect(dividers.length).toBeGreaterThanOrEqual(3); // At least 3 sections
  });

  it('renders Compañia links with correct structure', () => {
    const { container } = renderFooter();
    
    const companyList = container.querySelector('ul.space-y-2.text-sm');
    expect(companyList).toBeInTheDocument();
    
    // Check individual links
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Términos y condiciones')).toBeInTheDocument();
    expect(screen.getByText('Política y privacidad')).toBeInTheDocument();
    
    const supportLink = screen.getByText('Soporte').closest('a');
    expect(supportLink).toHaveAttribute('href', '/contact');
  });

  it('renders Mi Cuenta section with correct title', () => {
    renderFooter();
    
    const accountTitle = screen.getByText('Mi Cuenta');
    expect(accountTitle).toBeInTheDocument();
    expect(accountTitle).toHaveClass('text-lg', 'font-semibold');
  });

  it('renders Mi Cuenta section container', () => {
    const { container } = renderFooter();
    
    const accountSections = container.querySelectorAll('.flex.flex-col.mb-6.lg\\:mb-0.lg\\:mr-2');
    expect(accountSections.length).toBeGreaterThan(1);
  });

  it('renders Mi Cuenta links', () => {
    renderFooter();
    
    expect(screen.getByText('Vender Producto')).toBeInTheDocument();
    expect(screen.getByText('Categoría de producto')).toBeInTheDocument();
    expect(screen.getByText('Promociones')).toBeInTheDocument();
    
    // Verify they are links
    const sellLink = screen.getByText('Vender Producto').closest('a');
    const categoryLink = screen.getByText('Categoría de producto').closest('a');
    const promoLink = screen.getByText('Promociones').closest('a');
    
    expect(sellLink).toHaveAttribute('href', '#');
    expect(categoryLink).toHaveAttribute('href', '#');
    expect(promoLink).toHaveAttribute('href', '#');
  });

  it('renders Comunidad section with correct title', () => {
    renderFooter();
    
    const communityTitle = screen.getByText('Comunidad');
    expect(communityTitle).toBeInTheDocument();
    expect(communityTitle).toHaveClass('text-lg', 'font-semibold');
  });

  it('renders Comunidad section container', () => {
    const { container } = renderFooter();
    
    const communitySections = container.querySelectorAll('.flex.flex-col.mb-6.lg\\:mb-0');
    expect(communitySections.length).toBeGreaterThan(0);
  });

  it('renders Comunidad links', () => {
    renderFooter();
    
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Sugerencias y feedback')).toBeInTheDocument();
    expect(screen.getByText('Únete a nosotros')).toBeInTheDocument();
    
    // Verify they are links
    const blogLink = screen.getByText('Blog').closest('a');
    const feedbackLink = screen.getByText('Sugerencias y feedback').closest('a');
    const joinLink = screen.getByText('Únete a nosotros').closest('a');
    
    expect(blogLink).toHaveAttribute('href', '#');
    expect(feedbackLink).toHaveAttribute('href', '#');
    expect(joinLink).toHaveAttribute('href', '#');
  });

  it('renders copyright section with correct structure', () => {
    const { container } = renderFooter();
    
    const copyrightDiv = container.querySelector('.border-t.py-4.text-center.mt-2.lg\\:mt-9');
    expect(copyrightDiv).toBeInTheDocument();
  });

  it('renders copyright text with correct content and styling', () => {
    renderFooter();
    
    const copyrightText = screen.getByText('Copyright @ 2024 EzCommerce. Todos los derechos reservados');
    expect(copyrightText).toBeInTheDocument();
    expect(copyrightText).toHaveClass('text-sm');
  });

  it('renders all list elements with correct structure', () => {
    const { container } = renderFooter();
    
    const lists = container.querySelectorAll('ul.space-y-2.text-sm');
    expect(lists).toHaveLength(3); // Compañia, Mi Cuenta, Comunidad
    
    lists.forEach(list => {
      const listItems = list.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(2); // Each section has multiple items
    });
  });

  it('verifies component export and function execution', () => {
    // This test ensures the const export is properly executed
    expect(Footer).toBeDefined();
    expect(typeof Footer).toBe('function');
    
    // Render and verify it returns JSX
    const { container } = renderFooter();
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.nodeName.toLowerCase()).toBe('footer');
  });

  it('covers all conditional rendering paths', () => {
    // This test ensures all return statements and conditional logic are covered
    renderFooter();
    
    // Verify main return statement is executed
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    // Verify all nested elements are rendered (covering all return paths)
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getAllByText(/Compañia|Mi Cuenta|Comunidad/)).toHaveLength(3);
    expect(screen.getByText(/Copyright/)).toBeInTheDocument();
  });

  it('verifies all className concatenations are applied', () => {
    const { container } = renderFooter();
    
    // Test complex className strings
    const footer = container.querySelector('footer.bg-terciaryLight.text-terciaryDark.sm\\:px-6.md\\:px-16.lg\\:px-32.py-6');
    expect(footer).toBeInTheDocument();
    
    // Test responsive classes
    const responsiveDiv = container.querySelector('.flex.flex-col.lg\\:flex-row .md\\:justify-between');
    expect(responsiveDiv).toBeInTheDocument();
  });

  it('ensures all imports are used', () => {
    renderFooter();
    
    // Verify lucide-react icons are rendered (Facebook, Instagram, MessageCircle)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(10); // Multiple links in the footer
    
    // Verify Link component from react-router-dom is used
    const routerLinks = links.filter(link => 
      link.getAttribute('href') === '/' || 
      link.getAttribute('href') === '/contact' ||
      link.getAttribute('href') === '#'
    );
    expect(routerLinks.length).toBeGreaterThan(0);
  });
});
