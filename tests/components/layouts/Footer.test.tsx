import React from 'react';
import { screen } from '@testing-library/react';
import { Footer } from '../../../src/components/layouts/Footer';
import { render } from '../../utils/test-utils';

describe('Footer', () => {
  it('renders footer with logo and description', () => {
    render(<Footer />);

    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/Ezcommerce-logo-dark.png');

    expect(screen.getByText('Una tienda virtual creada para conectar y apoyar a universitarios, donde cada compra y venta fortalece nuestra comunidad.')).toBeInTheDocument();
  });

  it('renders social media icons with correct links', () => {
    render(<Footer />);

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    const messageLink = screen.getByRole('link', { name: /message/i });

    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(messageLink).toBeInTheDocument();

    // Check that they have proper href attributes (though they're "#" in this case)
    expect(facebookLink).toHaveAttribute('href', '#');
    expect(instagramLink).toHaveAttribute('href', '#');
    expect(messageLink).toHaveAttribute('href', '#');
  });

  it('renders Compañia section with correct links', () => {
    render(<Footer />);

    expect(screen.getByText('Compañia')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Términos y condiciones')).toBeInTheDocument();
    expect(screen.getByText('Política y privacidad')).toBeInTheDocument();
    
    const supportLink = screen.getByRole('link', { name: 'Soporte' });
    expect(supportLink).toBeInTheDocument();
    expect(supportLink).toHaveAttribute('href', '/contact');
  });

  it('renders Mi Cuenta section with correct links', () => {
    render(<Footer />);

    expect(screen.getByText('Mi Cuenta')).toBeInTheDocument();
    expect(screen.getByText('Vender Producto')).toBeInTheDocument();
    expect(screen.getByText('Categoría de producto')).toBeInTheDocument();
    expect(screen.getByText('Promociones')).toBeInTheDocument();
  });

  it('renders Comunidad section with correct links', () => {
    render(<Footer />);

    expect(screen.getByText('Comunidad')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Sugerencias y feedback')).toBeInTheDocument();
    expect(screen.getByText('Únete a nosotros')).toBeInTheDocument();
  });

  it('renders copyright section', () => {
    render(<Footer />);

    expect(screen.getByText('Copyright @ 2024 EzCommerce. Todos los derechos reservados')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-terciaryLight', 'text-terciaryDark');
  });

  it('renders logo as clickable link to home', () => {
    render(<Footer />);

    const logoLink = screen.getByRole('link', { name: /logo/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('has responsive layout classes', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const mainContainer = footer.querySelector('.flex.flex-col.lg\\:flex-row');
    expect(mainContainer).toBeInTheDocument();
  });

  it('social media icons have proper styling', () => {
    render(<Footer />);

    const socialIcons = screen.getAllByRole('link').filter(link => 
      link.querySelector('svg')
    );

    // Check that social icons have circular background styling
    socialIcons.forEach(icon => {
      const iconContainer = icon.querySelector('.flex.items-center.justify-center');
      if (iconContainer) {
        expect(iconContainer).toHaveClass('rounded-full');
      }
    });
  });
});
