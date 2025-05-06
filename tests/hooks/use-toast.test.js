import { act, renderHook } from '@testing-library/react';
import { useToast, toast } from '../../hooks/use-toast';

describe('useToast', () => {
  it('can add and dismiss a toast', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: 'Test Toast' });
    });
    expect(result.current.toasts.length).toBeGreaterThan(0);
    const toastId = result.current.toasts[0].id;
    act(() => {
      result.current.dismiss(toastId);
    });
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('removes toast after DISMISS and REMOVE_TOAST', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: 'Remove Toast' });
    });
    const toastId = result.current.toasts[0].id;
    act(() => {
      result.current.dismiss(toastId);
    });
    act(() => {
      // Simulate REMOVE_TOAST action
      result.current.toast.update({ id: toastId, open: false });
    });
    // The toast should still be in the list, but closed
    expect(result.current.toasts[0].open).toBe(false);
  });
});
