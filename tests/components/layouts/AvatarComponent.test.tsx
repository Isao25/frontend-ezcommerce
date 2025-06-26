import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AvatarComponent } from '@/components/layouts/AvatarComponent';

describe('AvatarComponent', () => {
  it('renders avatar with image', () => {
    render(<AvatarComponent />);
    
    const avatarImage = screen.getByRole('img');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'https://github.com/shadcn.png');
    expect(avatarImage).toHaveAttribute('alt', '@shadcn');
  });

  it('renders fallback when image fails to load', () => {
    render(<AvatarComponent />);
    
    // The fallback should be present in the DOM
    const fallback = screen.getByText('CN');
    expect(fallback).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<AvatarComponent />);
    
    const avatarImage = screen.getByRole('img');
    expect(avatarImage).toHaveAttribute('alt', '@shadcn');
  });
});

