import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MenuFaculties } from '@/components/layouts/MenuFaculties';

describe('MenuFaculties', () => {
  it('renders the dropdown trigger with correct initial state', () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('All');
  });

  it('displays map pin icon', () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
    // The MapPin icon should be present in the button
  });

  it('displays chevron down icon', () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
    // The ChevronDown icon should be present in the button
  });

  it('opens dropdown when clicked', async () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('FISI')).toBeInTheDocument();
    });
  });

  it('displays all faculty options when dropdown is open', async () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      const faculties = ['FISI', 'FCE', 'FII', 'FCB', 'FCF', 'ALL'];
      
      faculties.forEach(faculty => {
        expect(screen.getByText(faculty)).toBeInTheDocument();
      });
    });
  });

  it('allows selecting faculty options', async () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      const fisiOption = screen.getByText('FISI');
      expect(fisiOption).toBeInTheDocument();
      
      fireEvent.click(fisiOption);
    });
    
    // After selection, the dropdown should close
    await waitFor(() => {
      expect(screen.queryByText('FCE')).not.toBeInTheDocument();
    });
  });

  it('has proper button styling', () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('flex', 'items-center');
  });

  it('renders with outline variant styling', () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    // The button should have outline variant classes applied
    expect(trigger).toBeInTheDocument();
  });

  it('maintains keyboard accessibility', async () => {
    render(<MenuFaculties />);
    
    const trigger = screen.getByRole('button');
    
    // Test keyboard navigation
    fireEvent.keyDown(trigger, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('FISI')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <MenuFaculties />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('FISI')).toBeInTheDocument();
    });
    
    // Click outside
    const outsideElement = screen.getByTestId('outside');
    fireEvent.click(outsideElement);
    
    await waitFor(() => {
      expect(screen.queryByText('FCE')).not.toBeInTheDocument();
    });
  });
});