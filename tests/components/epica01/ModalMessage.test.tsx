// tests/components/ModalMessage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalMessage } from '../../../src/components/Epica1/ModalMessage';
import { AlertTriangle } from 'lucide-react';

describe('ModalMessage', () => {
  const setIsOpenMock = jest.fn();
  const buttonFuncMock = jest.fn();

  const baseProps = {
    isOpen: true,
    setIsOpen: setIsOpenMock,
    title: 'Confirmación',
    buttonName: 'Aceptar',
    children: <p>¿Estás seguro que deseas continuar?</p>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente el título, contenido y botón', () => {
    render(<ModalMessage {...baseProps} />);

    expect(screen.getByText('Confirmación')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro que deseas continuar?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /aceptar/i })).toBeInTheDocument();
  });

  it('ejecuta buttonFunc si se proporciona', () => {
    render(<ModalMessage {...baseProps} buttonFunc={buttonFuncMock} />);

    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));
    expect(buttonFuncMock).toHaveBeenCalled();
    expect(setIsOpenMock).not.toHaveBeenCalled();
  });

  it('cierra el modal si no se proporciona buttonFunc', () => {
    render(<ModalMessage {...baseProps} />);

    fireEvent.click(screen.getByRole('button', { name: /aceptar/i }));
    expect(setIsOpenMock).toHaveBeenCalledWith(false);
  });

});
