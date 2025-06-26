// src/hooks/__tests__/use-toast.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '../../src/hooks/use-toast';

describe('useToast hook', () => {
  beforeEach(() => {
    // Limpiar todos los toasts antes de cada test
    jest.clearAllMocks();
  });

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast when toast function is called', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      description: 'This is a test toast',
    });
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('should dismiss a specific toast', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    
    act(() => {
      const toastResult = toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      });
      toastId = toastResult.id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    // El toast debería estar marcado como open: false
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should dismiss all toasts when no toastId is provided', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
      toast({ title: 'Toast 3' });
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.dismiss();
    });

    // Todos los toasts deberían estar marcados como open: false
    result.current.toasts.forEach(toast => {
      expect(toast.open).toBe(false);
    });
  });

  it('should respect TOAST_LIMIT and remove oldest toast', () => {
    const { result } = renderHook(() => useToast());
    
    // Agregar más toasts que el límite
    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' }); // Este debería ser removido
    });

    // Debido al límite de 1, solo debería haber 1 toast
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Toast 2');
  });

  it('should create toast with all properties', () => {
    const { result } = renderHook(() => useToast());
    
    const mockAction = {
      label: 'Undo',
      onClick: jest.fn(),
    };

    act(() => {
      toast({
        title: 'Complete Toast',
        description: 'This is a complete toast',
        variant: 'destructive',
        action: mockAction,
      });
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Complete Toast',
      description: 'This is a complete toast',
      variant: 'destructive',
      action: mockAction,
    });
  });

  it('should handle toast success variant', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast.success('Success message');
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Success message',
      variant: 'default',
    });
  });

  it('should handle toast error variant', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast.error('Error message');
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Error message',
      variant: 'destructive',
    });
  });

  it('should auto-remove toast after delay', (done) => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      toast({ title: 'Auto remove toast' });
    });

    expect(result.current.toasts).toHaveLength(1);

    // Esperar más del tiempo de retraso (normalmente 1000000ms, pero podríamos mockear esto)
    setTimeout(() => {
      expect(result.current.toasts).toHaveLength(0);
      done();
    }, 100); // Usando un tiempo menor para el test
  });

  it('should generate unique IDs for multiple toasts', () => {
    const { result } = renderHook(() => useToast());
    
    let firstToastId: string;
    let secondToastId: string;

    act(() => {
      const firstToast = toast({ title: 'First Toast' });
      firstToastId = firstToast.id;
    });

    act(() => {
      const secondToast = toast({ title: 'Second Toast' });
      secondToastId = secondToast.id;
    });

    expect(firstToastId).not.toBe(secondToastId);
  });

  it('should update existing toast', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    
    act(() => {
      const toastResult = toast({ title: 'Original Title' });
      toastId = toastResult.id;
    });

    act(() => {
      toast({
        id: toastId,
        title: 'Updated Title',
        description: 'Updated Description',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      id: toastId,
      title: 'Updated Title',
      description: 'Updated Description',
    });
  });
});
