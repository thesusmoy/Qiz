import { renderHook, act } from '@testing-library/react';
import useDebounce from '../../hooks/use-debounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'a', delay: 500 },
      }
    );
    expect(result.current).toBe('a');
    rerender({ value: 'ab', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe('a');
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('ab');
  });
});
