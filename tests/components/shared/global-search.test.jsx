import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalSearch } from '../../../components/shared/global-search';

jest.mock('@/hooks/use-optimistic-ui', () => () => ({
  localValue: '',
  setLocalValue: jest.fn(),
  handleChange: jest.fn(),
  isPending: false,
}));
jest.mock('@/hooks/use-debounce', () => ({
  useDebounce: (fn) => fn,
}));

describe('GlobalSearch', () => {
  it('renders search input', () => {
    render(<GlobalSearch />);
    expect(
      screen.getByPlaceholderText(/search templates/i)
    ).toBeInTheDocument();
  });

  it('calls handleChange on input', async () => {
    render(<GlobalSearch />);
    const input = screen.getByPlaceholderText(/search templates/i);
    await userEvent.type(input, 'abc');
    expect(input).toHaveValue('abc');
  });
});
